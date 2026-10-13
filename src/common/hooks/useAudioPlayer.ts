
import { useEffect, useState } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/model/store.ts';
import { clearSeek, nextTrack, pauseTrack, playTrack, prevTrack, updateProgress } from "@/app/model/playerSlice.ts";

let globalAudioInstance: HTMLAudioElement | null = null;

if (typeof window !== 'undefined' && !globalAudioInstance) {
    globalAudioInstance = new Audio();
    globalAudioInstance.volume = 0.5; // Начальная дефолтная громкость
}

export const useAudioPlayer = () => {
    const dispatch = useDispatch();
    const {
        trackUrl,
        isPlaying,
        currentTrackId,
        trackData,
        isLooping,
        isShuffled,
        currentTime,
        duration,
        seekTo
    } = useSelector((state: RootState) => state.player);

    const [volume, setVolume] = useState(globalAudioInstance ? globalAudioInstance.volume : 0.5);

    // 1. УПРАВЛЕНИЕ ИСТОЧНИКОМ И ВОСПРОИЗВЕДЕНИЕМ (Остается синглтоном)
    useEffect(() => {
        const audio = globalAudioInstance;
        if (!audio || !trackUrl) return;

        let isEffectActive = true;

        if (audio.src !== trackUrl) {
            audio.src = trackUrl;
            audio.load();
        }

        if (isPlaying) {
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        if (!isEffectActive) {
                            audio.pause();
                        }
                    })
                    .catch((err) => {
                        if (err.name !== 'AbortError') {
                            console.error("Реальная ошибка воспроизведения:", err);
                            dispatch(pauseTrack());
                        }
                    });
            }
        } else {
            audio.pause();
        }

        return () => {
            isEffectActive = false;
        };
    }, [trackUrl, isPlaying, dispatch]);

    // 2. Синхронизация флага зацикливания трека
    useEffect(() => {
        if (globalAudioInstance) {
            globalAudioInstance.loop = isLooping;
        }
    }, [isLooping]);

    // 3. ЭФФЕКТ ДЛЯ ПЕРЕМОТКИ
    useEffect(() => {
        const audio = globalAudioInstance;
        if (!audio || seekTo === null) return;

        audio.currentTime = seekTo;
        dispatch(clearSeek());
    }, [seekTo, dispatch]);

    // 4. Подписку на события нативного плеера должен делать только ОДИН компонент,
    // чтобы не спамить лишними диспатчами в стор из 10 мест одновременно.
    // Традиционно события слушает только нижний плеер (AudioPlayerCore),
    // поэтому вешаем слушатели только если хук вызван в глобальном контексте (или ограничиваем логику)
    useEffect(() => {
        const audio = globalAudioInstance;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                dispatch(updateProgress({
                    currentTime: audio.currentTime,
                    duration: audio.duration
                }));
            }
        };

        const handleTrackEnded = () => {
            if (!audio.loop) {
                dispatch(nextTrack());
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleTimeUpdate);
        audio.addEventListener('durationchange', handleTimeUpdate);
        audio.addEventListener('ended', handleTrackEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleTimeUpdate);
            audio.removeEventListener('ended', handleTrackEnded);
        };
    }, [trackUrl, dispatch]);

    const handlePlayPauseToggle = () => {
        if (!currentTrackId || !trackUrl || !trackData) return;
        if (isPlaying) {
            dispatch(pauseTrack());
        } else {
            dispatch(playTrack({ track: { id: currentTrackId, url: trackUrl, data: trackData } }));
        }
    };

    const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
        const audio = globalAudioInstance;
        if (!audio || !duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickPercent = (e.clientX - rect.left) / rect.width;

        audio.currentTime = clickPercent * duration;
    };

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        if (globalAudioInstance) {
            globalAudioInstance.volume = value;
        }
    };

    return {
        trackData,
        trackUrl,
        isPlaying,
        isLooping,
        isShuffled,
        currentTime,
        duration,
        volume,
        handlePlayPauseToggle,
        handleProgressClick,
        handleVolumeChange,
        handleNextTrack: () => dispatch(nextTrack()),
        handlePrevTrack: () => dispatch(prevTrack()),
    };
};
