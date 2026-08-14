import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {PlaylistCover} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistCover/PlaylistCover.tsx";

type Props = {
    playlist: PlaylistData
    deletePlaylistHandler: (playlistId: string) => void
    editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({playlist, deletePlaylistHandler, editPlaylistHandler}: Props) => {


    return (
        <div>
            <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images}/>
            <div>title: {playlist.attributes.title}</div>
            <div>userName: {playlist.attributes.user.name}</div>
            <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
            <button onClick={() => editPlaylistHandler(playlist)}>update</button>
        </div>
    )
}