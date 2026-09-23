import { memo } from 'react';
import type { PlaylistData } from "@/features/playlists/api/playlists/playlistsApi.types.ts";
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

export const PlaylistItem = memo(({ playlist, deletePlaylistHandler, editPlaylistHandler }: Props) => {
    const originalCover = playlist.attributes.images.main?.find(img => img.type === 'original')
    const src = originalCover?.url || defaultCover

    const handleDelete = () => deletePlaylistHandler(playlist.id)
    const handleEdit = () => editPlaylistHandler(playlist)


    return (
        <div className={s.item}>
            <img className={s.cover} src={src} alt="cover" />
            <PlaylistDescription attributes={playlist.attributes} playlistId={playlist.id} />
            <div className={s.buttonsWrapper}>
                <button type="button" className={s.actionButton} onClick={handleDelete}>
                    delete
                </button>
                <button type="button" className={s.actionButton} onClick={handleEdit}>
                    update
                </button>
            </div>
        </div>
    )
})

PlaylistItem.displayName = 'PlaylistItem'
