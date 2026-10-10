import type {
    CreatePlaylistArgs,
    FetchPlaylistsArgs,
    PlaylistCreatedEvent, PlaylistData, PlaylistUpdateEvent,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import type {Images, ReactionUserResponse} from "@/common/types";
import {baseApi} from "@/app/api/baseApi.ts";
import {
    playlistCreateResponseSchema,
    playlistsResponseSchema,
} from "@/features/playlists/model/playlists.schemas.ts";
import {withZodCatch} from "@/common/utils";
import {imagesSchema, reactionUserResponseSchema} from "@/common/schemas";
import {SOCKET_EVENTS} from "@/common/constants";
import {subscribeToEvent} from "@/common/socket";

export const playlistsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchPlaylists: build.query({
            query: (params: FetchPlaylistsArgs) => ({url: `playlists`, params}),
            ...withZodCatch(playlistsResponseSchema),
            keepUnusedDataFor: 0,
            onCacheEntryAdded: async (_arg, {cacheDataLoaded, updateCachedData, cacheEntryRemoved}) => {
                await cacheDataLoaded;

                const unsubscribes = [
                    subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
                        const newPlaylist = msg.payload.data;
                        updateCachedData((state) => {
                            state.data.pop();
                            state.data.unshift(newPlaylist);
                            state.meta.totalCount = state.meta.totalCount + 1;
                            state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize);
                        });
                    }),
                    subscribeToEvent<PlaylistUpdateEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg) => {
                        const newPlaylist = msg.payload.data;
                        updateCachedData((state) => {
                            const index = state.data.findIndex(playlist => playlist.id === newPlaylist.id);
                            if (index !== -1) {
                                state.data[index] = {...state.data[index], ...newPlaylist};
                            }
                        });
                    })
                ];

                await cacheEntryRemoved;
                unsubscribes.forEach(unsubscribe => unsubscribe());
            },
            // Разделяем теги кэша на основе параметров поиска и сортировки,
            // чтобы RTK Query гарантированно перезапрашивал данные с сервера при смене SortBy
            providesTags: (result, _error, arg) => {
                const searchKey = arg.search || 'ALL';
                const sortKey = `${arg.sortBy || 'addedAt'}_${arg.sortDirection || 'desc'}`;

                return result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Playlist' as const, id })),
                        { type: 'Playlist', id: `LIST_${searchKey}_${sortKey}` },
                    ]
                    : [{ type: 'Playlist', id: 'LIST' }];
            },
        }),
        fetchPlaylistById: build.query<{ data: PlaylistData }, string>({
            query: (playlistId) => ({ url: `playlists/${playlistId}` }),
            ...withZodCatch(playlistCreateResponseSchema), // Парсим Zod-схемой для одиночного объекта плейлиста
            // Привязываем индивидуальный тег. Любые лайки или апдейты обложки этого ID автоматически обновят страницу!
            providesTags: (_result, _error, playlistId) => [{ type: 'Playlist', id: playlistId }],
        }),
        createPlaylist: build.mutation({
            query: (body: CreatePlaylistArgs) => ({
                url: 'playlists',
                method: 'post',
                body
            }),
            ...withZodCatch(playlistCreateResponseSchema),
            invalidatesTags: ['Playlist']
        }),
        deletePlaylist: build.mutation<void, string>({
            query: (playlistId) => ({
                url: `playlists/${playlistId}`,
                method: 'delete',
            }),
            invalidatesTags: ['Playlist']
        }),
        updatePlaylist: build.mutation<void, { playlistId: string, body: UpdatePlaylistArgs }>({
            query: ({playlistId, body}) => ({
                url: `playlists/${playlistId}`,
                method: 'put',
                body
            }),
            onQueryStarted: async ({playlistId, body}, {queryFulfilled, dispatch, getState}) => {
                const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists');
                const patchCollections: any[] = [];

                args.forEach(arg => {
                    patchCollections.push(dispatch(
                        playlistsApi.util.updateQueryData(
                            'fetchPlaylists',
                            {
                                pageNumber: arg.pageNumber,
                                pageSize: arg.pageSize,
                                search: arg.search,
                                // ИСПРАВЛЕНО: Передаем параметры сортировки в кэш-ключ,
                                // иначе ручное обновление стейта ломало кэш отсортированных страниц!
                                sortBy: arg.sortBy,
                                sortDirection: arg.sortDirection
                            },
                            (state) => {
                                const index = state.data.findIndex(playlist => playlist.id === playlistId);
                                if (index !== -1) {
                                    state.data[index].attributes = {...state.data[index].attributes, ...body.data.attributes};
                                }
                            }
                        )
                    ));
                });

                try {
                    await queryFulfilled;
                } catch (e) {
                    patchCollections.forEach(patchCollection => {
                        patchCollection.undo();
                    });
                }
            },
            invalidatesTags: ['Playlist']
        }),
        uploadPlaylistCover: build.mutation<Images, { playlistId: string, file: File }>({
            query: ({playlistId, file}) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'post',
                    body: formData
                };
            },
            ...withZodCatch(imagesSchema),
            invalidatesTags: ['Playlist']
        }),
        deletePlaylistCover: build.mutation<void, { playlistId: string }>({
            query: ({playlistId}) => ({url: `playlists/${playlistId}/images/main`, method: 'delete'}),
            invalidatesTags: ['Playlist']
        }),
        likePlaylist: build.mutation<ReactionUserResponse, string>({
            query: (playlistId) => ({
                url: `playlists/${playlistId}/likes`,
                method: 'post',
            }),
            ...withZodCatch(reactionUserResponseSchema),
            invalidatesTags: ['Playlist']
        }),
        dislikePlaylist: build.mutation<ReactionUserResponse, string>({
            query: (playlistId) => ({
                url: `playlists/${playlistId}/dislikes`,
                method: 'post',
            }),
            ...withZodCatch(reactionUserResponseSchema),
            invalidatesTags: ['Playlist']
        }),
        removeReactionPlaylist: build.mutation<ReactionUserResponse, string>({
            query: (playlistId) => ({
                url: `playlists/${playlistId}/reactions`,
                method: 'delete',
            }),
            ...withZodCatch(reactionUserResponseSchema),
            invalidatesTags: ['Playlist']
        })
    })
});

export const {
    useFetchPlaylistsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
    useUpdatePlaylistMutation,
    useUploadPlaylistCoverMutation,
    useDeletePlaylistCoverMutation,
    useLikePlaylistMutation,
    useDislikePlaylistMutation,
    useRemoveReactionPlaylistMutation,
    useFetchPlaylistByIdQuery
} = playlistsApi;
