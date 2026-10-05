// features/tracks/hooks/useTracksQueueSync.ts
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playTrack, updateQueue, type TrackItem } from "@/features/tracks/model/playerSlice.ts";
import { getTrackMetadata } from "@/features/tracks/lib/getTrackMetadata.ts";
import type { RootState } from "@/app/model/store.ts";
import type { TrackData, TracksIncluded } from "@/features/tracks/api/tracksApi.types.ts";

type UseTracksQueueSyncProps = {
    tracks: TrackData[];
    included: TracksIncluded[];
};

export const useTracksQueueSync = ({ tracks, included }: UseTracksQueueSyncProps) => {
    const dispatch = useDispatch();
    const { currentTrackId } = useSelector((state: RootState) => state.player);

    // 1. Создаем уникальный строковый ключ из ID всех треков в списке.
    // Ссылка на эту строку изменится ТОЛЬКО если треки реально добавились (скролл) или поменялись местами.
    const tracksSnapshotKey = useMemo(() => {
        return tracks.map(t => t.id).join(',');
    }, [tracks]);

    // Функция трансформации кэша RTK Query в плоскую структуру TrackItem[]
    // Переводим зависимости на примитивы и стабильные ссылки
    const mapTracksToQueue = useCallback((): TrackItem[] => {
        return tracks.map((t) => {
            const meta = getTrackMetadata(t, included);
            return {
                id: t.id,
                url: meta.audioUrl,
                data: {
                    title: t.attributes.title,
                    artistName: meta.artistName,
                    coverUrl: meta.coverSrc
                }
            };
        });
        // Используем tracksSnapshotKey вместо нестабильной ссылки на сам массив tracks
    }, [tracksSnapshotKey, included]);

    // Синхронизация бесконечного скролла
    useEffect(() => {
        if (!currentTrackId) return;

        const isCurrentListPlaying = tracks.some(t => t.id === currentTrackId);

        if (isCurrentListPlaying) {
            const updatedQueue = mapTracksToQueue();
            dispatch(updateQueue(updatedQueue));
        }
        // Заменяем tracks.length и mapTracksToQueue на tracksSnapshotKey.
        // Эффект сработает СТРОГО когда изменится состав треков или переключитсяcurrentTrackId.
    }, [tracksSnapshotKey, currentTrackId, dispatch]);

    // Обработчик клика по треку
    const handlePlayTrack = useCallback((targetTrack: TrackItem) => {
        const fullQueue = mapTracksToQueue();

        dispatch(playTrack({
            track: targetTrack,
            tracksList: fullQueue
        }));
    }, [mapTracksToQueue, dispatch]);

    return {
        handlePlayTrack
    };
};
