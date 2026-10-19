import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateTrackMutation } from "@/features/tracks/api/tracksApi.ts";
import type { TrackData } from "@/features/tracks/api/tracksApi.types.ts";

// Схема валидации на основе требований Swagger
const editTrackSchema = z.object({
    data: z.object({
        type: z.literal("tracks"),
        attributes: z.object({
            title: z.string().min(1, "Title is required").max(100, "Too long title"),
            lyrics: z.string().nullable().optional(),
        })
    })
});

type FormData = z.infer<typeof editTrackSchema>;

type UseEditTrackFormProps = {
    track: TrackData;
    onClose: () => void;
    onLoadingChange?: (isLoading: boolean) => void;
};

export const useEditTrackForm = ({ track, onClose, onLoadingChange }: UseEditTrackFormProps) => {
    const [updateTrack, { isLoading: isSubmitting }] = useUpdateTrackMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(editTrackSchema),
        defaultValues: {
            data: {
                type: "tracks",
                attributes: {
                    title: track.attributes.title || "",
                    lyrics: track.attributes.lyrics || "",
                }
            }
        }
    });

    // Синхронизация флага загрузки с родительским модальным окном
    useEffect(() => {
        if (onLoadingChange) {
            onLoadingChange(isSubmitting);
        }
    }, [isSubmitting, onLoadingChange]);

    const onSubmit = async (formData: FormData) => {
        try {
            // Формируем чистый Request Body под спецификацию API
            const requestBody = {
                data: {
                    type: "tracks",
                    attributes: {
                        title: formData.data.attributes.title,
                        // Если lyrics пустой, отправляем null в соответствии со Swagger
                        lyrics: formData.data.attributes.lyrics?.trim() || null,
                    }
                }
            };

            await updateTrack({ trackId: track.id, body: requestBody }).unwrap();
            onClose(); // Закрываем модалку при успешном обновлении
        } catch (error) {
            console.error("Failed to update track:", error);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting
    };
};
