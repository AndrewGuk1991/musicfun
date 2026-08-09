import s from './PlaylistsPage.module.css'
import {
    useDeletePlaylistMutation,
    useFetchPlaylistsQuery,
    useUpdatePlaylistMutation
} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {CreatePlaylistForm} from "@/features/playlists/ui";
import {type SubmitHandler, useForm} from "react-hook-form";
import type {
    PlaylistData,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {useState} from "react";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx";

export const PlaylistsPage = () => {

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


    const {data} = useFetchPlaylistsQuery()

    const [deletePlaylist] = useDeletePlaylistMutation()
    const [updatePlaylist] = useUpdatePlaylistMutation()

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

    const onSubmit: SubmitHandler<UpdatePlaylistArgs> = data => {
        if (!editingPlaylistId) return
        updatePlaylist({playlistId: editingPlaylistId, body: data}).unwrap().then(() => {
            setEditingPlaylistId(null)
        })

    }

    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm/>
            <div className={s.items}>
                {data?.data.map((playlist) => {

                    const isEditingPlaylist = editingPlaylistId === playlist.id

                    return <div className={s.item} key={playlist.id}>

                        {
                            isEditingPlaylist ?
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                        <input {...register('data.attributes.title')} placeholder={'title'}/>
                                    </div>
                                    <div>
                                        <input {...register('data.attributes.description')}
                                               placeholder={'description'}/>
                                    </div>
                                    <button type={"submit"}>save</button>
                                    <button onClick={() => editPlaylistHandler(null)}>cancel</button>
                                </form>
                                :
                                <PlaylistItem
                                    playlist={playlist}
                                    deletePlaylistHandler={deletePlaylistHandler}
                                    editPlaylistHandler={editPlaylistHandler}
                                />

                        }

                    </div>
                })
                }
            </div>
        </div>
    )
}