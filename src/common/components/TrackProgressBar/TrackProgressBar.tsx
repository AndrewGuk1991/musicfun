import type { MouseEvent } from 'react';
import s from "./TrackProgressBar.module.css";

type TrackProgressBarProps = {
    isActive: boolean;
    percent: number;
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
};

export const TrackProgressBar = ({ isActive, percent, onClick }: TrackProgressBarProps) => {
    return (
        <div
            className={`${s.progressBarContainer} ${isActive ? s.progressBarActive : ''}`}
            onClick={onClick}
        >
            <div
                className={s.progressBarFill}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
};
