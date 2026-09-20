import type { PlaylistData } from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import s from "./EditPlaylistForm.module.css";
import {useEditPlaylistForm} from "@/common/hooks/useEditPlaylistForm.ts";
import {
    PlaylistCoverInput
} from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/PlaylistCoverInput/PlaylistCoverInput.tsx";

type Props = {
    playlist: PlaylistData;
    onClose: () => void;
    onLoadingChange?: (isLoading: boolean) => void;
};

export const EditPlaylistForm = ({ playlist, onClose, onLoadingChange }: Props) => {
    const { register, handleSubmit, errors, coverUrl, coverFile, isSubmitting } =
        useEditPlaylistForm({ playlist, onClose, onLoadingChange });

    return (
        <form id="edit-playlist-form" onSubmit={handleSubmit} className={s.form}>
            <PlaylistCoverInput
                register={register}
                errors={errors}
                coverUrl={coverUrl}
                coverFile={coverFile}
                isSubmitting={isSubmitting}
            />

            <div className={s.inputField}>
                <label className={s.label}>
                    <span className={s.labelText}>Title input</span>
                    <input
                        {...register("data.attributes.title")}
                        placeholder="Playlist title"
                        disabled={isSubmitting}
                    />
                    {errors?.data?.attributes?.title?.message && (
                        <span className={s.errorText}>{errors.data.attributes.title.message}</span>
                    )}
                </label>

                <label className={s.label}>
                    <span className={s.labelText}>Description</span>
                    <input
                        {...register("data.attributes.description")}
                        placeholder="Playlist description"
                        disabled={isSubmitting}
                    />
                    {errors?.data?.attributes?.description?.message && (
                        <span className={s.errorText}>{errors.data.attributes.description.message}</span>
                    )}
                </label>
            </div>

        </form>
    );
};
