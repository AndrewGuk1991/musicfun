import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";

type Props = {
    playlist: PlaylistData
    deletePlaylistHandler: (playlistId: string) => void
    editPlaylistHandler: (playlist: PlaylistData) => void
}


export const PlaylistItem = ({playlist, deletePlaylistHandler, editPlaylistHandler}: Props) => {
    return (
        <div>
            <div>title: {playlist.attributes.title}</div>
            <div>userName: {playlist.attributes.user.name}</div>
            <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
            <button onClick={() => editPlaylistHandler(playlist)}>update</button>
        </div>
    )
}