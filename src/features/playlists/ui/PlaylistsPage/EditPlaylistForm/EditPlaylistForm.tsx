import { useEffect, useState } from "react";
import type { SubmitHandler, UseFormHandleSubmit, UseFormRegister, UseFormWatch } from "react-hook-form";
import { useUpdatePlaylistMutation, useUploadPlaylistCoverMutation } from "@/features/playlists/api/playlists/playlistsApi.ts";
import type { EditFormValues } from "../PlaylistsList/PlaylistsList.tsx";
import s from './EditPlaylistForm.module.css';

type Props = {
    register: UseFormRegister<EditFormValues>
    handleSubmit: UseFormHandleSubmit<EditFormValues>
    watch: UseFormWatch<EditFormValues>
    editingPlaylistId: string | null
    onClose: () => void
}

export const EditPlaylistForm = ({ register, handleSubmit, watch, editingPlaylistId, onClose }: Props) => {
    const [updatePlaylist, { isLoading: isUpdatingText }] = useUpdatePlaylistMutation()
    const [uploadPlaylistCover, { isLoading: isUploadingCover }] = useUploadPlaylistCoverMutation()

    const coverUrl = watch('data.attributes.coverUrl')
    const coverFile = watch('data.attributes.coverFile')

    const [previewImage, setPreviewImage] = useState<string | undefined>(coverUrl)

    useEffect(() => {
        let objectUrl: string | undefined

        if (coverFile && coverFile.length > 0) {
            objectUrl = URL.createObjectURL(coverFile[0])
            setPreviewImage(objectUrl)
        } else {
            setPreviewImage(coverUrl)
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [coverFile, coverUrl])

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
                const file = data.data.attributes.coverFile[0] // Достаем чистый File из коллекции FileList
                await uploadPlaylistCover({ playlistId: editingPlaylistId, file }).unwrap()
            }

            onClose()
        } catch (error) {
            console.error("Ошибка при сохранении плейлиста:", error)
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
                        {...register('data.attributes.coverFile')}
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
