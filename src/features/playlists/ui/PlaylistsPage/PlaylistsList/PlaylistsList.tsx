import s from './PlaylistsList.module.css'
import {EditPlaylistForm} from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx";
import {useState} from "react";
import {useDeletePlaylistMutation} from "@/features/playlists/api/playlists/playlistsApi.ts";
import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {Modal} from "@/common/components/Modal/Modal.tsx";

type Props = {
    playlists: PlaylistData[]
    isPlaylistLoading: boolean
}

export const PlaylistsList = ({playlists, isPlaylistLoading}: Props) => {
    const [activePlaylist, setActivePlaylist] = useState<PlaylistData | null>(null)
    const [deletePlaylist] = useDeletePlaylistMutation()

    const deletePlaylistHandler = (playlistId: string) => {
        if (confirm('Are you sure you want to delete this playlist?')) {
            deletePlaylist(playlistId)
        }
    }

    const editPlaylistHandler = (playlist: PlaylistData | null) => {
        setActivePlaylist(playlist)
    }

    const handleCloseModal = () => {
        setActivePlaylist(null)
    }

    return (
        <div className={s.items}>
            {!playlists.length && !isPlaylistLoading && <h2>Playlists not found</h2>}
            {playlists.map((playlist) => (
                <div className={s.item} key={playlist.id}>
                    <PlaylistItem
                        playlist={playlist}
                        deletePlaylistHandler={deletePlaylistHandler}
                        editPlaylistHandler={editPlaylistHandler}
                    />
                </div>
            ))}

            {activePlaylist && (
                <Modal isOpen={Boolean(activePlaylist)} onClose={handleCloseModal}>
                    <h3>Edit playlist</h3>

                    <EditPlaylistForm
                        playlist={activePlaylist}
                        onClose={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    )
}
