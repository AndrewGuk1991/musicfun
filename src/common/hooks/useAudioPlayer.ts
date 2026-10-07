
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/model/store.ts';
import { clearSeek, nextTrack, pauseTrack, playTrack, prevTrack, updateProgress } from "@/app/model/playerSlice.ts";

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

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [volume, setVolume] = useState(0.5); // Громкость по умолчанию: 50%

    // 1. Инициализируем HTMLAudioElement строго один раз при монтировании хука
    useEffect(() => {
        if (typeof window !== 'undefined' && !audioRef.current) {
            audioRef.current = new Audio();
            // Устанавливаем дефолтную громкость в нативный плеер сразу при создании
            audioRef.current.volume = volume;
        }
    }, []);

    // 2. БЕЗОПАСНАЯ СИНХРОНИЗАЦИЯ: Управление источником звука, воспроизведением и асинхронными Promise
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !trackUrl) return;

        // Флаг для отслеживания актуальности текущего цикла эффекта
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
                        // Если пока трек буферизировался, пользователь уже нажал на паузу — останавливаем
                        if (!isEffectActive) {
                            audio.pause();
                        }
                    })
                    .catch((err) => {
                        // Полностью игнорируем системные ошибки прерывания браузера (AbortError),
                        // они естественны при быстрой смене треков или двойном клике.
                        if (err.name !== 'AbortError') {
                            console.error("Реальная ошибка воспроизведения аудиофайла:", err);
                            dispatch(pauseTrack());
                        }
                    });
            }
        } else {
            audio.pause();
        }

        // При размонтировании эффекта или изменении зависимостей помечаем прошлый поток как неактивный
        return () => {
            isEffectActive = false;
        };
    }, [trackUrl, isPlaying, dispatch]);

    // 3. Синхронизация флага зацикливания трека (атрибут loop)
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLooping;
        }
    }, [isLooping]);

    // 4. ЭФФЕКТ ДЛЯ ПЕРЕМОТКИ: Реагирует на клики по прогресс-барам из любого места приложения
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || seekTo === null) return;

        audio.currentTime = seekTo; // Перематываем нативный плеер
        dispatch(clearSeek());       // Сбрасываем флаг запроса перемотки в Redux
    }, [seekTo, dispatch]);

    // 5. Подписка на нативные события прогресса аудиофайла и окончание трека
    useEffect(() => {
        const audio = audioRef.current;
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
            // Если включен loop, браузер сам начнет сначала. Если выключен — переключаем трек в очереди
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

    // Переключение состояния Воспроизведение / Пауза с центральной панели
    const handlePlayPauseToggle = () => {
        if (!currentTrackId || !trackUrl || !trackData) return;
        if (isPlaying) {
            dispatch(pauseTrack());
        } else {
            dispatch(playTrack({ track: { id: currentTrackId, url: trackUrl, data: trackData } }));
        }
    };

    // Перемотка трека по клику на центральный прогресс-бар в плеере
    const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickPercent = (e.clientX - rect.left) / rect.width;

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
