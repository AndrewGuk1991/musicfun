import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {
    PlaylistDescription
} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx";
import defaultCover from '@/assets/images/default-playlist-cover.png'
import s from './PlaylistItem.module.css'

type Props = {
    playlist: PlaylistData
    deletePlaylistHandler: (playlistId: string) => void
    editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({playlist, deletePlaylistHandler, editPlaylistHandler}: Props) => {

    const originalCover = playlist.attributes.images.main?.find(img => img.type === 'original')
    const src = originalCover ? originalCover?.url : defaultCover

    return (
        <div className={s.item}>
            <img className={s.cover} src={src} alt={'cover'}/>
            <PlaylistDescription attributes={playlist.attributes}/>
            <div className={s.buttonsWrapper}>
                <button className={s.actionButton} onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
                <button className={s.actionButton} onClick={() => editPlaylistHandler(playlist)}>update</button>
            </div>
        </div>
    )
}