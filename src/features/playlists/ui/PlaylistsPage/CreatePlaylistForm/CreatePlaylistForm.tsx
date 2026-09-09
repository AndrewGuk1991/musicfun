import {type SubmitHandler, useForm} from "react-hook-form";
import type {CreatePlaylistArgs} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import {useCreatePlaylistMutation} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {createPlaylistSchema} from "@/features/playlists/model/playlists.schemas.ts";
import s from './CreatePlaylistForm.module.css'

export const CreatePlaylistForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<CreatePlaylistArgs>({
        resolver: zodResolver(createPlaylistSchema),
        defaultValues: {
            data: {
                type: 'playlists',
                attributes: {
                    title: '',
                    description: ''
                }
            }
        }
    })

    const [createPlaylist] = useCreatePlaylistMutation()

    const onSubmit: SubmitHandler<CreatePlaylistArgs> = data => {
        createPlaylist(data).unwrap().then(() => {
            reset()
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Create new playlist</h2>
            <div>
                <input {...register('data.attributes.title')} placeholder={'title'}/>
                {errors.data?.attributes?.title &&
                    <span className={s.error}>{errors.data.attributes.title.message}</span>}
            </div>
            <div>
                <input {...register('data.attributes.description')} placeholder={'description'}/>
                {errors.data?.attributes?.description &&
                    <span className={s.error}>{errors.data.attributes.description.message}</span>}
            </div>
            <button>create playlist</button>
        </form>
    )
}