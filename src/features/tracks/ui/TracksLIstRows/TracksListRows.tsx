import s from './TracksListRows.module.css';
import type {TrackData, TracksIncluded} from "@/features/tracks/api/tracksApi.types.ts";
import {TrackRow} from "@/features/tracks/ui";

type Props = {
    tracks: TrackData[];
    included?: TracksIncluded[];
    isLoading?: boolean;
};

export const TracksListRows = ({tracks, included}: Props) => {
    return (
        <div className={s.tracksGrid}>
            {/* Шапка таблицы */}
            <div className={s.tracksHeader}>
                <div className={s.colIndex}>#</div>
                <div className={s.colTitle}>TITLE</div>
                <div></div> {/* Описание */}
                <div></div> {/* Отступ после прогресс-бара */}
                <div className={s.dateAddedHeader}>DATE ADDED</div>
                <div></div> {/* Место над кнопками экшенов (размер auto) */}
                {/* Ячейка с часами в самом конце строки */}
                <div className={s.colDuration}>
                    <div className={s.cssClock} title="Длительность"></div>
                </div>
            </div>

            {/* Список треков */}
            {tracks.map((track, index) => (
                <TrackRow key={track.id} index={index} track={track} included={included} />
            ))}
        </div>
    );
};
