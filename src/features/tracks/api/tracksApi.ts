import type {FetchTracksArgs, FetchTracksResponse} from "@/features/tracks/api/tracksApi.types.ts";
import { baseApi } from "@/app/api/baseApi.ts";
import { withZodCatch } from "@/common/utils";
import {fetchPlaylistTracksResponseSchema, fetchTracksResponseSchema} from "@/features/tracks/model/tracks.schemas.ts";
import type { ReactionUserResponse } from "@/common/types";
import { reactionUserResponseSchema } from "@/common/schemas";

export const tracksApi = baseApi.injectEndpoints({
    endpoints: build => ({
        // Глобальный бесконечный скролл (для главной страницы / страницы всех треков)
        fetchTracks: build.infiniteQuery<
            FetchTracksResponse,
            FetchTracksArgs,
            string | null
        >({
            infiniteQueryOptions: {
                initialPageParam: null,
                getNextPageParam: (lastPage) => lastPage.meta.nextCursor || null
            },
            query: ({ pageParam, queryArg }) => {
                return {
                    url: 'playlists/tracks',
                    params: {
                        cursor: pageParam,
                        paginationType: 'cursor',
                        pageSize: 5,
                        search: queryArg?.search || undefined,
                        sortBy: queryArg?.sortBy || 'addedAt', // Дефолт по добавлению
                        sortDirection: queryArg?.sortDirection || 'desc',
                    }
                };
            },
            providesTags: (result, _error, arg) => {
                const searchKey = arg.search || 'ALL';

                const sortKey = `${arg.sortBy || 'addedAt'}_${arg.sortDirection || 'desc'}`;

                return result
                    ? [
                        ...result.pages.flatMap((page) =>
                            page.data.map(({ id }) => ({ type: 'Track' as const, id }))
                        ),
                        { type: 'Track', id: `LIST_GLOBAL_${searchKey}_${sortKey}` },
                    ]
                    : [{ type: 'Track', id: 'LIST' }];
            },
            ...withZodCatch(fetchTracksResponseSchema)
        }),

        fetchPlaylistTracks: build.query<FetchTracksResponse, { playlistId: string; search?: string }>({
            query: ({ playlistId, search }) => ({
                url: `playlists/${playlistId}/tracks`,
                params: {
                    search: search || undefined,
                }
            }),
            providesTags: (_result, _error, { playlistId }) => [{ type: 'Track' as const, id: `PLAYLIST_${playlistId}` }],

            ...withZodCatch(fetchPlaylistTracksResponseSchema)
        }),

        fetchLastTracks: build.query<FetchTracksResponse, { pageSize: number }>({
            query: ({ pageSize }) => ({
                url: 'playlists/tracks',
                params: { paginationType: 'cursor', pageSize }
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Track' as const, id })),
                        { type: 'Track', id: 'LIST' },
                    ]
                    : [{ type: 'Track', id: 'LIST' }],
            ...withZodCatch(fetchTracksResponseSchema)
        }),

        likeTrack: build.mutation<ReactionUserResponse, string>({
            query: (trackId) => ({
                url: `playlists/tracks/${trackId}/likes`,
                method: 'post',
            }),
            invalidatesTags: (_result, _error, trackId) => [{ type: 'Track', id: trackId }],
            ...withZodCatch(reactionUserResponseSchema),
        }),

        dislikeTrack: build.mutation<ReactionUserResponse, string>({
            query: (trackId) => ({
                url: `playlists/tracks/${trackId}/dislikes`,
                method: 'post',
            }),
            invalidatesTags: (_result, _error, trackId) => [{ type: 'Track', id: trackId }],
            ...withZodCatch(reactionUserResponseSchema),
        }),

        removeReactionTrack: build.mutation<ReactionUserResponse, string>({
            query: (trackId) => ({
                url: `playlists/tracks/${trackId}/reactions`,
                method: 'delete',
            }),
            invalidatesTags: (_result, _error, trackId) => [{ type: 'Track', id: trackId }],
            ...withZodCatch(reactionUserResponseSchema),
        })
    })
})

export const {
    useFetchTracksInfiniteQuery,
    useFetchLastTracksQuery,
    useLikeTrackMutation,
    useDislikeTrackMutation,
    useRemoveReactionTrackMutation,
    useFetchPlaylistTracksQuery
} = tracksApi;
