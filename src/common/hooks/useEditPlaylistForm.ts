
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
    useUpdatePlaylistMutation,
    useUploadPlaylistCoverMutation,
} from "@/features/playlists/api/playlists/playlistsApi.ts";
import type { PlaylistData } from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import { errorToast } from "@/common/utils";
import type {EditFormValues} from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.types.ts";

type UseEditPlaylistFormArgs = {
    playlist: PlaylistData;
    onClose: () => void;
    onLoadingChange?: (isLoading: boolean) => void;
};

export const useEditPlaylistForm = ({ playlist, onClose, onLoadingChange }: UseEditPlaylistFormArgs) => {
    const [updatePlaylist, { isLoading: isUpdatingText }] = useUpdatePlaylistMutation();
    const [uploadPlaylistCover, { isLoading: isUploadingCover }] = useUploadPlaylistCoverMutation();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<EditFormValues>({
        mode: "onChange",
    });

    const coverUrl = watch("data.attributes.coverUrl");
    const coverFile = watch("data.attributes.coverFile");
    const isSubmitting = isUpdatingText || isUploadingCover;

    // Инициализация и сброс формы при изменении playlist
    useEffect(() => {
        if (playlist) {
            reset({
                data: {
                    type: "playlists",
                    attributes: {
                        title: playlist.attributes.title,
                        description: "описание не приходит с бэка",
                        tagIds: playlist.attributes.tags.map((t) => t.id),
                        coverUrl:
                            playlist.attributes.images.main?.find((img) => img.type === "original")?.url ||
                            defaultCover,
                        coverFile: undefined,
                    },
                },
            });
        }
    }, [playlist, reset]);

    useEffect(() => {
        onLoadingChange?.(isSubmitting);
    }, [isSubmitting, onLoadingChange]);

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
                            tagIds: data.data.attributes.tagIds,
                        },
                    },
                },
            }).unwrap();

            if (data.data.attributes.coverFile && data.data.attributes.coverFile.length > 0) {
                const file = data.data.attributes.coverFile[0];
                await uploadPlaylistCover({ playlistId: playlist.id, file }).unwrap();
            }
            onClose();
        } catch (error) {
            errorToast("Ошибка при сохранении плейлиста", error);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        coverUrl,
        coverFile,
        isSubmitting,
    };
};
