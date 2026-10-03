
import { useMemo } from 'react';
import type { TrackData, TracksIncluded } from "@/features/tracks/api/tracksApi.types.ts";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import { truncateText, useRelativeDate } from "@/common/utils";

export const useTrackMetadata = (track: TrackData, included: TracksIncluded[]) => {
    // 1. Поиск обложки (миниатюры) трека
    const coverSrc = useMemo(() => {
        const thumbnailCover = track.attributes.images.main?.find((img) => img.type === "thumbnail");
        return thumbnailCover?.url || defaultCover;
    }, [track.attributes.images.main]);

    // 2. Поиск имени артиста по связям в массиве included
    const artistName = useMemo(() => {
        const artistId = track.relationships?.artists?.data?.[0]?.id;
        if (!artistId) return "Unknown Artist";

        const artistData = included.find((item) => item.id === artistId && item.type === "artists");
        return artistData?.attributes?.name || "Unknown Artist";
    }, [track.relationships?.artists?.data, included]);

    // 3. Форматирование заголовка и даты добавления
    const truncatedTitle = useMemo(() => truncateText(track.attributes.title, 30), [track.attributes.title]);
    const relativeDate = useRelativeDate(track.attributes.addedAt || "");

    // 4. Поиск подходящего аудиофайла в аттачментах
    const audioUrl = useMemo(() => {
        const audioAttachment = track.attributes.attachments?.find(
            (file) => file.contentType.startsWith("audio/") || file.url.endsWith(".mp3")
        ) || track.attributes.attachments?.[0];

        return audioAttachment?.url || "";
    }, [track.attributes.attachments]);

    return {
        coverSrc,
        artistName,
        truncatedTitle,
        relativeDate,
        audioUrl
    };
};
