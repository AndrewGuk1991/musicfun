import {useSelector} from "react-redux";
import type {RootState} from "@/app/model/store.ts";
import {playlistsApi} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {tracksApi} from "@/features/tracks/api/tracksApi.ts";

const excludedEndpoints = [
    playlistsApi.endpoints.fetchPlaylists.name,
    tracksApi.endpoints.fetchTracks.name,
]

export const useGlobalLoading = () => {
    return useSelector((state: RootState) => {
        const queries = Object.values(state.baseApi.queries || {})
        const mutations = Object.values(state.baseApi.mutations || {})

        const hasActiveQueries = queries.some(query => {
            if (query?.status !== 'pending') return

            // 1. СТРАНИЦА TRACKS: Полностью отключаем полоску всегда (и при первой загрузке, и при скролле)
            if (query.endpointName === tracksApi.endpoints.fetchTracks.name) {
                return false;
            }

            if (excludedEndpoints.includes(query.endpointName)) {
                const completedQueries = queries.filter(query => query?.status === 'fulfilled')
                return completedQueries.length > 0
            }

        })

        const hasActiveMutations = mutations.some(mutation => mutation?.status === 'pending')

        return hasActiveQueries || hasActiveMutations
    })
}
