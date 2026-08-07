import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlists/playlistsApi.ts";


export const PlaylistsPage = () => {

    const {data} = useFetchPlaylistsQuery()

    return (
        <div>
            <h1>Playlists page</h1>
            <div>{
                data?.data.map((playlist) => {
                    return <div key={playlist.id}>
                        {playlist.attributes.title}
                    </div>
                })
            }</div>
        </div>
    )
}