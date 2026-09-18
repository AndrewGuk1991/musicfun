import { useEffect, useState } from "react";
import type {
    SubmitHandler,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormWatch,
    FieldErrors
} from "react-hook-form";
import { useUpdatePlaylistMutation, useUploadPlaylistCoverMutation } from "@/features/playlists/api/playlists/playlistsApi.ts";
import type { EditFormValues } from "../PlaylistsList/PlaylistsList.tsx";

import s from './EditPlaylistForm.module.css';
import {errorToast, validateCover} from "@/common/utils";

type Props = {
    register: UseFormRegister<EditFormValues>
    handleSubmit: UseFormHandleSubmit<EditFormValues>
    watch: UseFormWatch<EditFormValues>
    errors: FieldErrors<EditFormValues>
    editingPlaylistId: string | null
    onClose: () => void
}

export const EditPlaylistForm = ({ register, handleSubmit, watch, errors, editingPlaylistId, onClose }: Props) => {
    const [updatePlaylist, { isLoading: isUpdatingText }] = useUpdatePlaylistMutation()
    const [uploadPlaylistCover, { isLoading: isUploadingCover }] = useUploadPlaylistCoverMutation()

    const coverUrl = watch('data.attributes.coverUrl')
    const coverFile = watch('data.attributes.coverFile')

    const [previewImage, setPreviewImage] = useState<string | undefined>(coverUrl)

    // Эффект для обновления превью картинки
    useEffect(() => {
        let objectUrl: string | undefined

        // Если файл выбран и на нем нет ошибок валидации — создаем blob-ссылку
        if (coverFile && coverFile.length > 0 && !errors.data?.attributes?.coverFile) {
            const file = coverFile[0]

            objectUrl = URL.createObjectURL(file)
            setPreviewImage(objectUrl)
        } else {
            setPreviewImage(coverUrl)
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [coverFile, coverUrl, errors.data?.attributes?.coverFile])

    const isSubmitting = isUpdatingText || isUploadingCover

    const onSubmit: SubmitHandler<EditFormValues> = async (data) => {
        if (!editingPlaylistId) return

        try {
            await updatePlaylist({
                playlistId: editingPlaylistId,
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
                await uploadPlaylistCover({ playlistId: editingPlaylistId, file }).unwrap()
            }

            onClose()
        } catch (error) {
            errorToast("Ошибка при сохранении плейлиста", error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
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
                        {...register('data.attributes.coverFile', {
                            validate: validateCover})}
                    />
                </label>
            </div>

            <div className={s.inputField}>
                <input {...register('data.attributes.title')} placeholder="Playlist title" disabled={isSubmitting} />
            </div>

            <div className={s.inputField}>
                <input {...register('data.attributes.description')} placeholder="Playlist description" disabled={isSubmitting} />
            </div>

            <div className={s.actions}>
                <button type="button" className={s.btnCancel} onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit" className={s.btnSave} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}
