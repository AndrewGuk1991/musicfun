
import type { MouseEvent } from 'react';
import s from './PlayToggleButton.module.css';

type PlayToggleButtonProps = {
    isPlaying: boolean;
    onPlayPause: (e: MouseEvent<HTMLButtonElement>) => void;
    size?: 'small' | 'medium' | 'large';
    bgColor?: string;
    iconColor?: string;
};

export const PlayToggleButton = ({
                                     isPlaying,
                                     onPlayPause,
                                     size = 'medium',
                                     bgColor,
                                     iconColor,
                                 }: PlayToggleButtonProps) => {

    const sizeClass = s[`size_${size}`];

    return (
        <button
            className={`${s.mainPlayBtn} ${sizeClass}`}
            onClick={onPlayPause}
            style={{
                backgroundColor: bgColor,
                color: iconColor
            }}
            title={isPlaying ? "Stop" : "Play"}
            type="button"
        >
            <div className={`${s.iconControl} ${isPlaying ? s.pause : s.play}`} />
        </button>
    );
};
