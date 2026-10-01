

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/model/store.ts';
import {pauseTrack} from "@/features/tracks/model/playerSlice.ts";


export const AudioPlayerCore = () => {
    const dispatch = useDispatch();
    const { trackUrl, isPlaying } = useSelector((state: RootState) => state.player);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Инициализация аудио при старте приложения
    useEffect(() => {
        audioRef.current = new Audio();

        // Когда трек доиграл до конца — ставим на паузу эквалайзер
        audioRef.current.onended = () => {
            dispatch(pauseTrack());
        };

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [dispatch]);

    // Реакция на изменение ссылки на трек
    useEffect(() => {
        if (!audioRef.current || !trackUrl) return;

        // Меняем источник звука на URL из вложений бэкенда
        audioRef.current.src = trackUrl;
        audioRef.current.load();

        if (isPlaying) {
            audioRef.current.play().catch((err) => {
                console.error("Ошибка воспроизведения:", err);
                dispatch(pauseTrack());
            });
        }
    }, [trackUrl]);

    // Реакция на изменение флага воспроизведения (пауза/плей)
    useEffect(() => {
        if (!audioRef.current || !trackUrl) return;

        if (isPlaying) {
            audioRef.current.play().catch(() => dispatch(pauseTrack()));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, trackUrl]);

    return null;
};
