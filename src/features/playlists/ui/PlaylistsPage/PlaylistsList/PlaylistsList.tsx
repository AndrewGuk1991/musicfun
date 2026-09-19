import s from './PlaylistsList.module.css'
import modalStyles from '@/common/components/Modal/Modal.module.css'

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
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)

    const [deletePlaylist] = useDeletePlaylistMutation()

    const uniquePlaylists = playlists.filter(
        (playlist, index, self) => self.findIndex((p) => p.id === playlist.id) === index
    )

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
            {!uniquePlaylists.length && !isPlaylistLoading && <h2>Playlists not found</h2>}
            {uniquePlaylists.map((playlist) => (
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
                    <Modal.Header>
                        <h3>Edit playlist</h3>
                    </Modal.Header>

                    <Modal.Body>
                        <EditPlaylistForm
                            playlist={activePlaylist}
                            onClose={handleCloseModal}
                            onLoadingChange={setIsFormSubmitting}
                        />
                    </Modal.Body>

                    <Modal.Footer>
                            <button type="button" className={modalStyles.btnCancel} onClick={handleCloseModal} disabled={isFormSubmitting}>
                                Cancel
                            </button>
                            <button type="submit" form="edit-playlist-form" className={modalStyles.btnSave} disabled={isFormSubmitting}>
                                {isFormSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    )
}


