import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {PlaylistCover} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistCover/PlaylistCover.tsx";
import {
    PlaylistDescription
} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx";

type Props = {
    playlist: PlaylistData
    deletePlaylistHandler: (playlistId: string) => void
    editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({playlist, deletePlaylistHandler, editPlaylistHandler}: Props) => {


    return (
        <div>
            <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images}/>
            <PlaylistDescription attributes={playlist.attributes}/>
            <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
            <button onClick={() => editPlaylistHandler(playlist)}>update</button>
        </div>
    )
}