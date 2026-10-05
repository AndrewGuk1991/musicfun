// features/tracks/lib/getTrackMetadata.ts
import type { TrackData, TracksIncluded } from "@/features/tracks/api/tracksApi.types.ts";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import { truncateText } from "@/common/utils";

export const getTrackMetadata = (track: TrackData, included: TracksIncluded[]) => {
    // 1. Поиск обложки (миниатюры) трека
    const thumbnailCover = track.attributes.images.main?.find((img) => img.type === "thumbnail");
    const coverSrc = thumbnailCover?.url || defaultCover;

    // 2. Поиск имени артиста по связям в массиве included
    const artistId = track.relationships?.artists?.data?.[0]?.id;
    let artistName = "Unknown Artist";
    if (artistId) {
        const artistData = included.find((item) => item.id === artistId && item.type === "artists");
        artistName = artistData?.attributes?.name || "Unknown Artist";
    }

    // 3. Форматирование заголовка
    const truncatedTitle = truncateText(track.attributes.title, 30);

    // 4. Поиск подходящего аудиофайла в аттачментах
    const audioAttachment = track.attributes.attachments?.find(
        (file) => file.contentType.startsWith("audio/") || file.url.endsWith(".mp3")
    ) || track.attributes.attachments?.[0];
    const audioUrl = audioAttachment?.url || "";

    return {
        coverSrc,
        artistName,
        truncatedTitle,
        audioUrl,
    };
};
