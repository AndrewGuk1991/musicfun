import s from './TracksList.module.css';
import { TitleSkeleton } from "@/common/components/Skeletons/TitleSkeleton/TitleSkeleton.tsx";

import { TrackItem } from "../TrackItem/TrackItem.tsx";
import type { TrackData, TracksIncluded } from "@/features/tracks/api/tracksApi.types.ts";
import {TracksListGridSkeleton} from "@/common/components/Skeletons/TracksListGridSkeleton/TracksListGridSkeleton.tsx";

type Props = {
    tracks: TrackData[];
    included?: TracksIncluded[];
    isLoading?: boolean;
    isTitleSkeleton: boolean;
};

export const TracksList = ({ tracks, included, isLoading, isTitleSkeleton }: Props) => {

    // 1. Состояние загрузки (Показываем пульсирующий скелетон вместо заголовка и сетку скелетонов треков)
    if (isLoading) {
        return (
            <div className={s.container}>
                {isTitleSkeleton && <TitleSkeleton />}
                <TracksListGridSkeleton count={10} />
            </div>
        );
    }

    // 2. Состояние "Не найдено" (Если бэк ответил успешно, но новых треков нет)
    if (!tracks || tracks.length === 0) {
        return (
            <div className={s.container}>
                <h2 className={s.title}>Tracks not found</h2>
            </div>
        );
    }

    // 3. Успешный рендер данных (Заголовок + Сетка с треками)
    return (
            <div className={s.tracksGrid}>
                {tracks.map((track) => (
                        <TrackItem track={track} included={included} key={track.id}/>
                ))}
            </div>
    );
};
