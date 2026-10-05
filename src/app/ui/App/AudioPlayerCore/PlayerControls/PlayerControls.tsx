import type { MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { toggleLoop, toggleShuffle } from "@/features/tracks/model/playerSlice.ts";
import { formatDuration } from "@/common/utils/formatDuration"; // Замените путь на ваш реальный путь к утилите
import s from "./PlayerControls.module.css";

type PlayerControlsProps = {
    isPlaying: boolean;
    isLooping: boolean;
    isShuffled: boolean;
    currentTime: number;
    duration: number;
    onPlayPause: () => void;
    onProgressClick: (e: MouseEvent<HTMLDivElement>) => void;
    onNextTrack: () => void;
    onPrevTrack: () => void;
};

export const PlayerControls = ({
                                   isPlaying,
                                   isLooping,
                                   isShuffled,
                                   currentTime,
                                   duration,
                                   onPlayPause,
                                   onProgressClick,
                                   onNextTrack,
                                   onPrevTrack,
                               }: PlayerControlsProps) => {
    const dispatch = useDispatch();
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={s.centerControlsBlock}>
            {/* Кнопки управления */}
            <div className={s.buttonsRow}>
                <button
                    className={`${s.controlBtn} ${isShuffled ? s.activeControl : ''}`}
                    onClick={() => dispatch(toggleShuffle())}
                    title="Перемешать"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                    </svg>
                </button>

                <button className={s.controlBtn} onClick={onPrevTrack} title="Предыдущий трек">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                </button>

                <button className={s.mainPlayBtn} onClick={onPlayPause} title={isPlaying ? "Пауза" : "Воспроизвести"}>
                    {isPlaying ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    )}
                </button>

                <button className={s.controlBtn} onClick={onNextTrack} title="Следующий трек">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6zm9-12v12h2V6z"/>
                    </svg>
                </button>

                <button
                    className={`${s.controlBtn} ${isLooping ? s.activeControl : ''}`}
                    onClick={() => dispatch(toggleLoop())}
                    title="Повторять трек"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v3h12v-6h-2v4z"/>
                    </svg>
                </button>
            </div>

            {/* Полоса воспроизведения (Таймлайн) */}
            <div className={s.progressRow}>
                <span className={s.timeLabel}>{formatDuration(currentTime)}</span>
                <div className={s.progressBarContainer} onClick={onProgressClick}>
                    <div className={s.progressBarFill} style={{ width: `${progressPercent}%` }} />
                </div>
                <span className={s.timeLabel}>{formatDuration(duration)}</span>
            </div>
        </div>
    );
};
