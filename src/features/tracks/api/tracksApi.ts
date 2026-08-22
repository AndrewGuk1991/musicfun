import {baseApi} from "@/app/baseApi.ts";
import type {FetchTracksResponse} from "@/features/tracks/api/tracksApi.types.ts";


export const tracksApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchTracks: build.query<FetchTracksResponse, void>({
            query: () => ({
                url: 'playlists/tracks'
            })
        })
    })
})

export const {useFetchTracksQuery} = tracksApi