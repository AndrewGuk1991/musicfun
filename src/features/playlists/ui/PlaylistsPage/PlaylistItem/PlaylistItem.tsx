import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import defaultCover from '@/assets/images/default-playlist-cover.png'
import s from './Playlist.module.css'
import {useUploadPlaylistCoverMutation} from "@/features/playlists/api/playlists/playlistsApi.ts";
import type {ChangeEvent} from "react";

type Props = {
    playlist: PlaylistData
    deletePlaylistHandler: (playlistId: string) => void
    editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({playlist, deletePlaylistHandler, editPlaylistHandler}: Props) => {

    const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()

    const originalCover = playlist.attributes.images.main.find(img => img.type === 'original')
    const src = originalCover ? originalCover.url : defaultCover

    const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.length && event.target.files[0]
        if (!file) return;
        uploadPlaylistCover({playlistId: playlist.id, file})
    }

    return (
        <div>
            <img src={src} alt="cover" width={'240px'} className={s.cover}/>
            <input type="file" onChange={uploadCoverHandler}/>
            <div>title: {playlist.attributes.title}</div>
            <div>userName: {playlist.attributes.user.name}</div>
            <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
            <button onClick={() => editPlaylistHandler(playlist)}>update</button>
        </div>
    )
}