// features/tracks/hooks/useTrackMetadata.ts
import { useMemo } from 'react';
import type { TrackData, TracksIncluded } from "@/features/tracks/api/tracksApi.types.ts";
import {getTrackMetadata} from "@/features/tracks/lib";
import {useRelativeDate} from "@/common/hooks/useRelativeDate.ts";

export const useTrackMetadata = (track: TrackData, included: TracksIncluded[]) => {
    // Получаем отформатированные данные с мемоизацией, чтобы не парсить объект при каждом шорохе
    const metadata = useMemo(() => {
        return getTrackMetadata(track, included);
    }, [track, included]);

    // Дату оставляем отдельно, так как внутри используется хук времени
    const relativeDate = useRelativeDate(track.attributes.addedAt || "");

    return {
        ...metadata,
        relativeDate
    };
};
