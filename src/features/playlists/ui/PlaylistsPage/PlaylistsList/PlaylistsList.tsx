import s from './PlaylistsList.module.css'
import {EditPlaylistForm} from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx";
import {useState} from "react";
import {useDeletePlaylistMutation} from "@/features/playlists/api/playlists/playlistsApi.ts";
import type {PlaylistData, UpdatePlaylistArgs} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {useForm} from "react-hook-form";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import {Modal} from "@/common/components/Modal/Modal.tsx";

type Props = {
    playlists: PlaylistData[]
    isPlaylistLoading: boolean
}

export type EditFormValues = UpdatePlaylistArgs & {
    data: {
        attributes: {
            coverUrl?: string;
            coverFile?: FileList;
        }
    }
}

export const PlaylistsList = ({playlists, isPlaylistLoading}: Props) => {
    const [activePlaylist, setActivePlaylist] = useState<PlaylistData | null>(null)


    const {register, handleSubmit, reset, watch} = useForm<EditFormValues>(
        {
            defaultValues: {
                data: {
                    type: 'playlists',
                    attributes: {
                        title: '',
                        description: '',
                        tagIds: [''],
                        coverUrl: '',
                        coverFile: undefined
                    }
                },
            }
        }
    )

    const [deletePlaylist] = useDeletePlaylistMutation()


    const deletePlaylistHandler = (playlistId: string) => {
        if (confirm('Are you sure you want to delete this playlist?')) {
            deletePlaylist(playlistId)
        }
    }


    const editPlaylistHandler = (playlist: PlaylistData | null) => {
        setActivePlaylist(playlist)

        if (playlist) {
            reset({
                data: {
                    type: 'playlists',
                    attributes: {
                        title: playlist.attributes.title,
                        description: 'описание не приходит с бэка',
                        tagIds: playlist.attributes.tags.map(t => t.id),
                        coverUrl: playlist.attributes.images.main?.find(img => img.type === 'original')?.url || defaultCover
                    }
                }
            })
        } else {
            reset()
        }
    }

    const handleCloseModal = () => {
        editPlaylistHandler(null)
    }

    return (
        <div className={s.items}>
            {!playlists.length && !isPlaylistLoading && <h2>Playlists not found</h2>}
            {playlists.map((playlist) => {
                return <div className={s.item} key={playlist.id}>
                    <PlaylistItem
                        playlist={playlist}
                        deletePlaylistHandler={deletePlaylistHandler}
                        editPlaylistHandler={editPlaylistHandler}
                    />
                </div>
            }
            )}

            {activePlaylist && (
                <Modal isOpen={Boolean(activePlaylist)} onClose={handleCloseModal}>
                    <h3>Редактировать плейлист</h3>

                    <EditPlaylistForm
                        register={register}
                        handleSubmit={handleSubmit}
                        watch={watch}
                        editingPlaylistId={activePlaylist.id}
                        onClose={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    )
}