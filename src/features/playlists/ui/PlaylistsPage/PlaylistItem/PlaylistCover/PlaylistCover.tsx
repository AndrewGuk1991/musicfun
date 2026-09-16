import {
    useDeletePlaylistCoverMutation,
    useUploadPlaylistCoverMutation
} from "@/features/playlists/api/playlists/playlistsApi.ts";
import type {ChangeEvent} from "react";
import defaultCover from '@/assets/images/default-playlist-cover.png'
import type {Images} from "@/common/types";
import s from './PlaylistCover.module.css'
import {errorToast} from "@/common/utils";

type Props = {
    playlistId: string
    images: Images
}

export const PlaylistCover = ({ images, playlistId }: Props) => {
    const originalCover = images.main?.find(img => img.type === 'original')
    const src = originalCover ? originalCover?.url : defaultCover

    const [uploadCover] = useUploadPlaylistCoverMutation()
    const [deleteCover] = useDeletePlaylistCoverMutation()

    const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {

        const maxSize = 1024 * 1024 // 1 MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

        const file = event.target.files?.length && event.target.files[0]
        if (!file) return

        if (!allowedTypes.includes(file.type)) {
            errorToast('Only JPEG, PNG or GIF images are allowed')
            return
        }

        if (file.size > maxSize) {
            errorToast(`The file is too large (max. ${Math.round(maxSize / 1024)} KB)`)
            return
        }

        uploadCover({ playlistId, file })
    }

    const deleteCoverHandler = () => deleteCover({ playlistId })

    return (
        <div className={s.coverWrapper}>
            <label className={s.dropzone}>
                <img src={src} alt={'cover'} className={s.cover} />
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={uploadCoverHandler}
                    className={s.hiddenInput}
                />
                <span className={s.overlayText}>Выбрать фото</span>
            </label>

            {originalCover
                &&
                <button className={s.deleteBtn} onClick={() => deleteCoverHandler()}>
                    delete cover
                </button>}
        </div>
    )
}