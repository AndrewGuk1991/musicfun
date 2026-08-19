import s from './PlaylistsList.module.css'
import {EditPlaylistForm} from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx";
import {useState} from "react";
import {useDeletePlaylistMutation} from "@/features/playlists/api/playlists/playlistsApi.ts";
import type {PlaylistData, UpdatePlaylistArgs} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {useForm} from "react-hook-form";

type Props = {
    playlists: PlaylistData[]
    isPlaylistLoading: boolean
}

export const PlaylistsList = ({playlists, isPlaylistLoading}: Props) => {
    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)


    const {register, handleSubmit, reset} = useForm<UpdatePlaylistArgs>(
        {
            defaultValues: {
                data: {
                    type: 'playlists',
                    attributes: {
                        tagIds: ['']
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
        if (playlist) {
            setEditingPlaylistId(playlist.id)
            reset({
                data: {
                    type: 'playlists',
                    attributes: {
                        title: playlist.attributes.title,
                        description: 'описание не приходит с бэка',
                        tagIds: playlist.attributes.tags.map(t => t.id),
                    }
                }
            })
        } else {
            setEditingPlaylistId(null)
        }
    }

    return (
        <div className={s.items}>
            {!playlists.length && !isPlaylistLoading && <h2>Playlists not found</h2>}
            {playlists.map((playlist) => {

                const isEditingPlaylist = editingPlaylistId === playlist.id

                return <div className={s.item} key={playlist.id}>

                    {
                        isEditingPlaylist ?
                            <EditPlaylistForm
                                editingPlaylistId={editingPlaylistId}
                                setEditingPlaylistId={setEditingPlaylistId}
                                editPlaylist={editPlaylistHandler}
                                handleSubmit={handleSubmit}
                                register={register}
                            />
                            :
                            <PlaylistItem
                                playlist={playlist}
                                deletePlaylistHandler={deletePlaylistHandler}
                                editPlaylistHandler={editPlaylistHandler}
                            />

                    }
                </div>
            })}
        </div>
    )
}