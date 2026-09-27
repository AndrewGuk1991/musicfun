import s from './PlaylistsList.module.css'
import {PlaylistItem} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx";
import {useMemo} from "react";
import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";

import {PlaylistsGridSkeleton} from "@/common/components/Skeletons/PlaylistsGridSkeleton/PlaylistsGridSkeleton.tsx";

type Props = {
    playlists: PlaylistData[]
    isLoading: boolean
    countSkeleton?: number
}

export const PlaylistsList = ({ playlists, isLoading, countSkeleton }: Props) => {
    // const [activePlaylist, setActivePlaylist] = useState<PlaylistData | null>(null)
    // const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    // const [deletePlaylist] = useDeletePlaylistMutation()

    const uniquePlaylists = useMemo(() => {
        return playlists.filter(
            (playlist, index, self) => self.findIndex((p) => p.id === playlist.id) === index
        )
    }, [playlists])

    // const deletePlaylistHandler = useCallback((playlistId: string) => {
    //     if (confirm('Are you sure you want to delete this playlist?')) {
    //         deletePlaylist(playlistId)
    //     }
    // }, [deletePlaylist])
    //
    // const editPlaylistHandler = useCallback((playlist: PlaylistData | null) => {
    //     setActivePlaylist(playlist)
    // }, [])
    //
    // const handleCloseModal = useCallback(() => {
    //     setActivePlaylist(null)
    // }, [])

    // --- Логика рендеринга состояний ---

    // 1. Состояние загрузки
    if (isLoading) return <PlaylistsGridSkeleton count={countSkeleton || 5} />


    // 2. Состояние "Не найдено"
    if (!uniquePlaylists.length) return <h2 className={s.title}>Playlists not found</h2>


    // 3. Успешный рендер данных
    return (
        <div>
            <div className={s.items}>
                {uniquePlaylists.map((playlist) => (
                        <PlaylistItem
                            key={playlist.id}
                            playlist={playlist}
                        />
                ))}

                {/*{activePlaylist && (*/}
                {/*    <Modal isOpen={Boolean(activePlaylist)} onClose={handleCloseModal}>*/}
                {/*        <Modal.Header><h3>Edit playlist</h3></Modal.Header>*/}
                {/*        <Modal.Body>*/}
                {/*            <EditPlaylistForm*/}
                {/*                playlist={activePlaylist}*/}
                {/*                onClose={handleCloseModal}*/}
                {/*                onLoadingChange={setIsFormSubmitting}*/}
                {/*            />*/}
                {/*        </Modal.Body>*/}
                {/*        <Modal.Footer>*/}
                {/*            <button type="button" className={modalStyles.btnCancel} onClick={handleCloseModal} disabled={isFormSubmitting}>*/}
                {/*                Cancel*/}
                {/*            </button>*/}
                {/*            <button type="submit" form="edit-playlist-form" className={modalStyles.btnSave} disabled={isFormSubmitting}>*/}
                {/*                {isFormSubmitting ? 'Saving...' : 'Save Changes'}*/}
                {/*            </button>*/}
                {/*        </Modal.Footer>*/}
                {/*    </Modal>*/}
                {/*)}*/}
            </div>
        </div>
    )
}
