import {memo} from 'react';
import defaultCover from '@/assets/images/default-playlist-cover.png'
import s from './PlaylistCard.module.css'
import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {
    PlaylistDescription
} from "@/features/playlists/ui/PlaylistsPage/PlaylistCard/PlaylistDescription/PlaylistDescription.tsx";
import {Path} from "@/common/routing";
import {Link} from "react-router";

type Props = {
    playlist: PlaylistData
    deletePlaylistHandler?: (playlistId: string) => void
    editPlaylistHandler?: (playlist: PlaylistData) => void
}

export const PlaylistCard = memo(({playlist}: Props) => {
    const originalCover = playlist.attributes.images.main?.find(img => img.type === 'original')
    const src = originalCover?.url || defaultCover

    // const handleDelete = () => deletePlaylistHandler(playlist.id)
    // const handleEdit = () => editPlaylistHandler(playlist)

    const playlistUrl = Path.PlaylistSingle.replace(':id', playlist.id)

    return (
        <Link to={playlistUrl} className={s.cardLink}>
            <div className={s.playlistCard}>
                <img className={s.cover} src={src} alt="cover"/>
                <PlaylistDescription attributes={playlist.attributes} playlistId={playlist.id}/>
                {/*<div className={s.buttonsWrapper}>*/}
                {/*    <button type="button" className={s.actionButton} onClick={handleDelete}>*/}
                {/*        delete*/}
                {/*    </button>*/}
                {/*    <button type="button" className={s.actionButton} onClick={handleEdit}>*/}
                {/*        update*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </Link>
    )
})

