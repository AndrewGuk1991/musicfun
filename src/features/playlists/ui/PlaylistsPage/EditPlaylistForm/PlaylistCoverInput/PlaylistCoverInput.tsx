import { useEffect, useState } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import { validateCover } from "@/common/utils";
import s from "./PlaylistCoverInput.module.css";
import type {EditFormValues} from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.types.ts";

type Props = {
    register: UseFormRegister<EditFormValues>;
    errors: FieldErrors<EditFormValues>;
    coverUrl?: string;
    coverFile?: FileList;
    isSubmitting: boolean;
};

export const PlaylistCoverInput = ({
                                       register,
                                       errors,
                                       coverUrl,
                                       coverFile,
                                       isSubmitting,
                                   }: Props) => {
    const [previewImage, setPreviewImage] = useState<string | undefined>(coverUrl);

    useEffect(() => {
        let objectUrl: string | undefined;

        if (coverFile && coverFile.length > 0 && !errors.data?.attributes?.coverFile) {
            const file = coverFile[0];
            objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        } else {
            setPreviewImage(coverUrl);
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [coverFile, coverUrl, errors.data?.attributes?.coverFile]);

    return (
        <div className={s.coverContainer}>
            <div className={s.imageWrapper}>
                {previewImage ? (
                    <img src={previewImage} alt="Playlist cover preview" className={s.previewImage} />
                ) : (
                    <span className={s.noImage}>No Cover Image</span>
                )}
            </div>
            <label className={`${s.fileInputLabel} ${isSubmitting ? s.disabled : ''}`}>
                Upload Cover Image
                <input
                    type="file"
                    accept="image/*"
                    className={s.fileInput}
                    disabled={isSubmitting}
                    {...register("data.attributes.coverFile", { validate: validateCover })}
                />
            </label>
            {errors.data?.attributes?.coverFile && (
                <span className={s.error}>{errors.data.attributes.coverFile.message}</span>
            )}
        </div>
    );
};
