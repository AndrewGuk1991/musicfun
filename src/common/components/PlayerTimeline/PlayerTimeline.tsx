import type { MouseEvent } from "react";
import { formatDuration } from "@/common/utils/formatDuration";
import s from "./PlayerTimeline.module.css"; // Локальные стили таймлайна

type PlayerTimelineProps = {
    currentTime: number;
    duration: number;
    onProgressClick: (e: MouseEvent<HTMLDivElement>) => void;
};

export const PlayerTimeline = ({ currentTime, duration, onProgressClick }: PlayerTimelineProps) => {
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={s.progressRow}>
            <span className={s.timeLabel}>{formatDuration(currentTime)}</span>
            <div className={s.progressBarContainer} onClick={onProgressClick}>
                <div className={s.progressBarFill} style={{ width: `${progressPercent}%` }} />
            </div>
            <span className={s.timeLabel}>{formatDuration(duration)}</span>
        </div>
    );
};
