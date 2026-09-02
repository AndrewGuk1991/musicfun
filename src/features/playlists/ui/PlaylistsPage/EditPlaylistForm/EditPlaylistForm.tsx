import type { UpdatePlaylistArgs } from "@/features/playlists/api/playlists/playlistsApi.types"
import type {SubmitHandler, UseFormHandleSubmit, UseFormRegister} from "react-hook-form";
import {useUpdatePlaylistMutation} from "@/features/playlists/api/playlists/playlistsApi.ts";

type Props = {
    register: UseFormRegister<UpdatePlaylistArgs>
    handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
    editingPlaylistId: string | null
    setEditingPlaylistId: (playlistId: null) => void
    editPlaylist: (playlist: null) => void
}

export const EditPlaylistForm = ({register, handleSubmit, editingPlaylistId, setEditingPlaylistId, editPlaylist}: Props) => {

    const [updatePlaylist] = useUpdatePlaylistMutation()

    const onSubmit: SubmitHandler<UpdatePlaylistArgs> = data => {
        if (!editingPlaylistId) return
        updatePlaylist({playlistId: editingPlaylistId, body: data})
        setEditingPlaylistId(null)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input {...register('data.attributes.title')} placeholder={'title'}/>
            </div>
            <div>
                <input {...register('data.attributes.description')}
                       placeholder={'description'}/>
            </div>
            <button type={"submit"}>save</button>
            <button onClick={() => editPlaylist(null)}>cancel</button>
        </form>
    )
}