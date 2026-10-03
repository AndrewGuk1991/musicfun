import { useState, useEffect, useCallback } from 'react';
import type { MouseEvent } from 'react';

export const useTrackAudioProgress = (isCurrentTrack: boolean, audioUrl: string) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        // Если строка не является текущим играющим треком, сбрасываем время и выходим
        if (!isCurrentTrack) {
            setCurrentTime(0);
            setDuration(0);
            return;
        }

        const audio = (document.getElementById('global-audio') || document.querySelector('audio')) as HTMLAudioElement | null;
        if (!audio) return;

        // Функция синхронизации состояния хука с реальным плеером
        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        // Подписываемся на события HTML5 Audio
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);
        audio.addEventListener('durationchange', updateProgress);

        // Сразу вызываем один раз на случай, если метаданные уже загружены глобальным плеером
        updateProgress();

        // Чистим подписки при размонтировании или смене трека
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
            audio.removeEventListener('durationchange', updateProgress);
        };
    }, [isCurrentTrack, audioUrl]);

    // Расчет процентов заполнения прогресс-бара
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Логика клика/перемотки по прогресс-бару
    const handleProgressClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isCurrentTrack) return;

        const audio = document.getElementById('global-audio') as HTMLAudioElement | null;
        if (!audio || !duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercent = clickX / rect.width;

        audio.currentTime = clickPercent * duration;
    }, [isCurrentTrack, duration]);

    return {
        currentTime,
        duration,
        progressPercent,
        handleProgressClick
    };
};
