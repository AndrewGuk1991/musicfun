import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useUpdatePlaylistMutation, useUploadPlaylistCoverMutation } from "@/features/playlists/api/playlists/playlistsApi.ts";
import type { PlaylistData, UpdatePlaylistArgs } from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import {errorToast, validateCover} from "@/common/utils";
import s from './EditPlaylistForm.module.css';

export type EditFormValues = UpdatePlaylistArgs & {
    data: {
        attributes: {
            coverUrl?: string;
            coverFile?: FileList;
        }
    }
}

type Props = {
    playlist: PlaylistData;
    onClose: () => void;
    onLoadingChange?: (isLoading: boolean) => void;
}

export const EditPlaylistForm = ({ playlist, onClose, onLoadingChange }: Props) => {
    const [updatePlaylist, { isLoading: isUpdatingText }] = useUpdatePlaylistMutation()
    const [uploadPlaylistCover, { isLoading: isUploadingCover }] = useUploadPlaylistCoverMutation()

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<EditFormValues>({
        mode: 'onChange',
    })

    const coverUrl = watch('data.attributes.coverUrl')
    const coverFile = watch('data.attributes.coverFile')

    const [previewImage, setPreviewImage] = useState<string | undefined>(coverUrl)

    useEffect(() => {
        if (playlist) {
            reset({
                data: {
                    type: 'playlists',
                    attributes: {
                        title: playlist.attributes.title,
                        description: 'описание не приходит с бэка',
                        tagIds: playlist.attributes.tags.map(t => t.id),
                        coverUrl: playlist.attributes.images.main?.find(img => img.type === 'original')?.url || defaultCover,
                        coverFile: undefined
                    }
                }
            })
        }
    }, [playlist, reset])

    useEffect(() => {
        let objectUrl: string | undefined

        if (coverFile && coverFile.length > 0 && !errors.data?.attributes?.coverFile) {
            const file = coverFile[0]
            objectUrl = URL.createObjectURL(file)
            setPreviewImage(objectUrl)
        } else {
            setPreviewImage(coverUrl)
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [coverFile, coverUrl, errors.data?.attributes?.coverFile])

    const isSubmitting = isUpdatingText || isUploadingCover

    useEffect(() => {
        onLoadingChange?.(isSubmitting)
    }, [isSubmitting, onLoadingChange])

    const onSubmit: SubmitHandler<EditFormValues> = async (data) => {
        try {
            await updatePlaylist({
                playlistId: playlist.id,
                body: {
                    data: {
                        type: data.data.type,
                        attributes: {
                            title: data.data.attributes.title,
                            description: data.data.attributes.description,
                            tagIds: data.data.attributes.tagIds
                        }
                    }
                }
            }).unwrap()

            if (data.data.attributes.coverFile && data.data.attributes.coverFile.length > 0) {
                const file = data.data.attributes.coverFile[0]
                await uploadPlaylistCover({ playlistId: playlist.id, file }).unwrap()
            }

            onClose()
        } catch (error) {
            errorToast("Ошибка при сохранении плейлиста", error)
        }
    }

    return (
        <form id="edit-playlist-form" onSubmit={handleSubmit(onSubmit)} className={s.form}>
            <div className={s.coverContainer}>
                <div className={s.imageWrapper}>
                    {previewImage ? (
                        <img src={previewImage} alt="Playlist cover preview" className={s.previewImage} />
                    ) : (
                        <span className={s.noImage}>No Cover Image</span>
                    )}
                </div>

                <label className={s.fileInputLabel}>
                    Choose File
                    <input
                        type="file"
                        accept="image/*"
                        className={s.fileInput}
                        disabled={isSubmitting}
                        {...register('data.attributes.coverFile', { validate: validateCover })}
                    />
                </label>
            </div>

            <div className={s.inputField}>
                <input {...register('data.attributes.title')} placeholder="Playlist title" disabled={isSubmitting} />
            </div>

            <div className={s.inputField}>
                <input {...register('data.attributes.description')} placeholder="Playlist description" disabled={isSubmitting} />
            </div>
        </form>
    )
}
