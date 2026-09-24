import type {FetchTracksResponse} from "@/features/tracks/api/tracksApi.types.ts";
import {baseApi} from "@/app/api/baseApi.ts";
import {withZodCatch} from "@/common/utils";
import {fetchTracksResponseSchema} from "@/features/tracks/model/tracks.schemas.ts";
import type {ReactionUserResponse} from "@/common/types";
import {reactionUserResponseSchema} from "@/common/schemas";

export const tracksApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | null>({
            infiniteQueryOptions: {
                initialPageParam: null,
                getNextPageParam: (lastPage) => (
                    lastPage.meta.nextCursor || null
                )
            },
            query: ({pageParam}) => ({
                url: 'playlists/tracks',
                params: {cursor: pageParam, paginationType: 'cursor', pageSize: 5}
            }),
            //  ИСПРАВЛЕНО: Безопасно собираем ID треков со всех загруженных страниц пагинации
            providesTags: (result) =>
                result
                    ? [
                        ...result.pages.flatMap((page) =>
                            page.data.map(({ id }) => ({ type: 'Track' as const, id }))
                        ),
                        { type: 'Track', id: 'LIST' },
                    ]
                    : [{ type: 'Track', id: 'LIST' }],
            ...withZodCatch(fetchTracksResponseSchema)
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
    useRemoveReactionTrackMutation
} = tracksApi
