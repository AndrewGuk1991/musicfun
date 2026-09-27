import s from './TracksList.module.css';

import {TrackItem} from "../TrackItem/TrackItem.tsx";
import type {TrackData, TracksIncluded} from "@/features/tracks/api/tracksApi.types.ts";
import {TracksListGridSkeleton} from "@/common/components/Skeletons/TracksListGridSkeleton/TracksListGridSkeleton.tsx";

type Props = {
    tracks: TrackData[];
    included?: TracksIncluded[];
    isLoading?: boolean;
};

export const TracksList = ({tracks, included, isLoading}: Props) => {

    // 1. Состояние загрузки (Показываем пульсирующий скелетон вместо заголовка и сетку скелетонов треков)
    if (isLoading) return <TracksListGridSkeleton count={10}/>

    // 2. Состояние "Не найдено" (Если бэк ответил успешно, но новых треков нет)
    if (!tracks.length) return <h2 className={s.title}>Tracks not found</h2>

    // 3. Успешный рендер данных (Заголовок + Сетка с треками)
    return (
        <div className={s.tracksGrid}>
            {tracks.map((track) => (
                <TrackItem track={track} included={included} key={track.id}/>
            ))}
        </div>
    );
};
