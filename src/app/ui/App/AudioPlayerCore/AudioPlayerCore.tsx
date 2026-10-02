import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/model/store.ts';
import { pauseTrack, playTrack, toggleLoop, toggleShuffle } from "@/features/tracks/model/playerSlice.ts";

import s from "./AudioPlayerCore.module.css";

const formatDuration = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const AudioPlayerCore = () => {
    const dispatch = useDispatch();
    const { trackUrl, isPlaying, currentTrackId, trackData, isLooping, isShuffled } = useSelector((state: RootState) => state.player);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5); // Громкость по умолчанию: 50%

    // Синхронизация воспроизведения с Redux
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !trackUrl) return;

        if (audio.src !== trackUrl) {
            audio.src = trackUrl;
            audio.load();
        }

        if (isPlaying) {
            audio.play().catch((err) => {
                console.error("Ошибка воспроизведения:", err);
                dispatch(pauseTrack());
            });
        } else {
            audio.pause();
        }
    }, [trackUrl, isPlaying, dispatch]);

    // Синхронизация флага зацикливания трека
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLooping;
        }
    }, [isLooping]);

    // Подписка на обновления прогресса аудиофайла
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);
        audio.addEventListener('durationchange', updateProgress);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
            audio.removeEventListener('durationchange', updateProgress);
        };
    }, [trackUrl]);

    const handlePlayPauseToggle = () => {
        if (!currentTrackId || !trackUrl || !trackData) return;
        if (isPlaying) {
            dispatch(pauseTrack());
        } else {
            dispatch(playTrack({ id: currentTrackId, url: trackUrl, data: trackData }));
        }
    };

    const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercent = clickX / rect.width;

        audio.currentTime = clickPercent * duration;
    };

    // Изменение уровня громкости
    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        if (audioRef.current) {
            audioRef.current.volume = value;
        }
    };

    if (!trackUrl || !trackData) return null;

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={s.playerWrapper}>
            <div className={s.playerContainer}>

                {/* ЛЕВАЯ ЧАСТЬ: Информация о треке */}
                <div className={s.trackInfoBlock}>
                    <img className={s.cover} src={trackData.coverUrl} alt="player cover" />
                    <div className={s.textMeta}>
                        <span className={s.title}>{trackData.title}</span>
                        <span className={s.artist}>{trackData.artistName}</span>
                    </div>
                </div>

                {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Блок управления и Таймлайн прогресса */}
                <div className={s.centerControlsBlock}>
                    {/* Кнопки переключения состояний */}
                    <div className={s.buttonsRow}>
                        <button
                            className={`${s.controlBtn} ${isShuffled ? s.activeControl : ''}`}
                            onClick={() => dispatch(toggleShuffle())}
                            title="Перемешать"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
                        </button>

                        <button className={s.controlBtn} title="Предыдущий трек">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                        </button>

                        <button className={s.mainPlayBtn} onClick={handlePlayPauseToggle} title={isPlaying ? "Пауза" : "Воспроизвести"}>
                            {isPlaying ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            )}
                        </button>

                        <button className={s.controlBtn} title="Следующий трек">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6zm9-12v12h2V6z"/></svg>
                        </button>

                        <button
                            className={`${s.controlBtn} ${isLooping ? s.activeControl : ''}`}
                            onClick={() => dispatch(toggleLoop())}
                            title="Повторять трек"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v3h12v-6h-2v4z"/></svg>
                        </button>
                    </div>

                    {/* Полоса воспроизведения */}
                    <div className={s.progressRow}>
                        <span className={s.timeLabel}>{formatDuration(currentTime)}</span>
                        <div className={s.progressBarContainer} onClick={handleProgressClick}>
                            <div className={s.progressBarFill} style={{ width: `${progressPercent}%` }} />
                        </div>
                        <span className={s.timeLabel}>{formatDuration(duration)}</span>
                    </div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ: Ползунок громкости */}
                <div className={s.rightControlsBlock}>
                    <div className={s.volumeContainer}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{color: 'var(--color-gray-400)'}}>
                            {volume === 0 ? (
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM4 9v6h4l5 5V4L8 9H4zm16.5 3c0 3.11-2.04 5.74-4.83 6.64l.01 2.11C19.78 19.8 22.5 16.22 22.5 12c0-4.22-2.72-7.8-6.82-8.75l-.01 2.11c2.79.9 4.83 3.53 4.83 6.64z"/>
                            ) : (
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            )}
                        </svg>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className={s.volumeSlider}
                        />
                    </div>
                </div>

            </div>

            <audio
                ref={audioRef}
                id="global-audio"
                preload="metadata"
                crossOrigin="anonymous"
                onEnded={() => dispatch(pauseTrack())}
            />
        </div>
    );
};

