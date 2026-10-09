// common/hooks/useGlobalLoading.ts
import { useSelector } from "react-redux";
import type { RootState } from "@/app/model/store.ts";
import { playlistsApi } from "@/features/playlists/api/playlists/playlistsApi.ts";
import { tracksApi } from "@/features/tracks/api/tracksApi.ts";
import type { FetchTracksArgsInternal } from "@/features/tracks/api/tracksApi.types.ts";

export const useGlobalLoading = () => {
    return useSelector((state: RootState) => {
        const queries = Object.values(state.baseApi.queries || {});
        const mutations = Object.values(state.baseApi.mutations || {});

        const hasActiveQueries = queries.some(query => {
            if (query?.status !== 'pending') return false;

            // 1. УСЛОВИЕ ДЛЯ СТРАНИЦЫ TRACKS (fetchTracks)
            if (query.endpointName === tracksApi.endpoints.fetchTracks.name) {
                const originalArgs = query.originalArgs as FetchTracksArgsInternal | undefined;
                const pageParam = originalArgs?.pageParam;

                // Если pageParam существует — это дозагрузка при бесконечном скролле. Отключаем.
                if (pageParam !== null && pageParam !== undefined) {
                    return false;
                }

                // Проверяем, есть ли уже в кэше ХОТЯ БЫ ОДИН успешный запрос fetchTracks.
                const hasFulfilledTracks = queries.some(
                    q => q?.endpointName === tracksApi.endpoints.fetchTracks.name && q?.status === 'fulfilled'
                );

                // Если успешных запросов ещё не было — это ПЕРВАЯ загрузка страницы.
                // Отключаем полоску, так как в этот момент на экране будут работать скелетоны!
                if (!hasFulfilledTracks) {
                    return false;
                }

                // В противном случае (если кэш уже был) — это смена сортировки или поиск. Включаем полоску!
                return true;
            }

            // 2. СТРАНИЦА PLAYLISTS (fetchPlaylists)
            if (query.endpointName === playlistsApi.endpoints.fetchPlaylists.name) {
                return true;
            }

            return true;
        });

        const hasActiveMutations = mutations.some(mutation => mutation?.status === 'pending');

        return hasActiveQueries || hasActiveMutations;
    });
};
