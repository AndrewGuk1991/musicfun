
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from "./TrackRow.module.css";
import type { RootState } from "@/app/model/store.ts";
import { useTrackMetadata, useTrackReactions } from "@/common/hooks";
import { formatDuration } from "@/common/utils";
import { PlayingBars, ReactionActions, TrackProgressBar } from "@/common/components";
import type { TrackData, TracksIncluded } from "@/features/tracks/api/tracksApi.types.ts";
import type {TrackItem} from "@/app/model/player.types.ts";
import {pauseTrack, seekTrack} from "@/app/model/playerSlice.ts";

type TrackRowProps = {
    track: TrackData;
    index: number;
    included?: TracksIncluded[];
    onPlay: (trackItem: TrackItem) => void;
};

export const TrackRow = React.memo(({ track, index, included = [], onPlay }: TrackRowProps) => {
    const dispatch = useDispatch();

    // 1. Стабильные селекторы: меняются редко (только при клике на паузу или смене трека).
    // Пассивные строки больше не будут перерисовываться при изменении секунд в плеере.
    const currentTrackId = useSelector((state: RootState) => state.player.currentTrackId);
    const isPlaying = useSelector((state: RootState) => state.player.isPlaying);

    const isCurrentTrack = currentTrackId === track.id;
    const isTrackPlayingNow = isCurrentTrack && isPlaying;

    // 2. Динамические селекторы времени: подписывают на обновления ТОЛЬКО активный трек.
    // Для остальных строк они всегда возвращают 0, полностью блокируя лишние ререндеры.
    const currentTime = useSelector((state: RootState) => isCurrentTrack ? state.player.currentTime : 0);
    const duration = useSelector((state: RootState) => isCurrentTrack ? state.player.duration : 0);

    // Парсинг метаданных трека
    const { coverSrc, artistName, truncatedTitle, relativeDate, audioUrl } = useTrackMetadata(track, included);

    // Логика лайков/дизлайков и обращений к API
    const { currentReaction, isAnyActionLoading, handleLikeClick, handleDislikeClick, likesCount } = useTrackReactions(track);

    // Вычисляем процент заполнения шкалы только для активной строки
    const progressPercent = isCurrentTrack && duration > 0 ? (currentTime / duration) * 100 : 0;

    // Вычисление итоговой длительности (динамическая во время воспроизведения, нативная в покое)
    const displayDuration = isCurrentTrack && duration > 0
        ? formatDuration(duration)
        : formatDuration(track.attributes.duration || 0);

    const handlePlayToggle = () => {
        if (isTrackPlayingNow) {
            dispatch(pauseTrack());
        } else {
            // Передаем плоский объект типа TrackItem наверх в обработчик родителя
            onPlay({
                id: track.id,
                url: audioUrl,
                data: {
                    title: track.attributes.title,
                    artistName: artistName,
                    coverUrl: coverSrc
                }
            });
        }
    };

    // Функция перемотки по клику на полосу прогресса внутри текущей строки
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isCurrentTrack || duration === 0) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickPercent = (e.clientX - rect.left) / rect.width;
        const targetSeconds = clickPercent * duration;

        // Отправляем запрос на перемотку в Redux. Хук useAudioPlayer поймает его и применит к аудиофайлу
        dispatch(seekTrack(targetSeconds));
    };

    return (
        <div className={`${s.item} ${isCurrentTrack ? s.activeItem : ''}`}>

            {/* 1-я колонка: Описание (Анимация/Номер + Обложка + Название) */}
            <div className={s.description} onClick={handlePlayToggle}>
                {isTrackPlayingNow ? (
                    <PlayingBars />
                ) : (
                    <span className={`${s.number} ${isCurrentTrack ? s.activeNumber : ''}`}>
                        {index + 1}
                    </span>
                )}

                <img className={s.cover} src={coverSrc} alt="cover" />
                <div className={s.info}>
                    <span className={`${s.title} ${isCurrentTrack ? s.activeTitle : ''}`}>
                        {truncatedTitle}
                    </span>
                    <span className={s.artist}>{artistName}</span>
                </div>
            </div>

            {/* 2-я колонка: Пустой отступ (1fr из grid-template-columns) */}
            <div></div>

            {/* 3-я колонка: Полоска воспроизведения */}
            <TrackProgressBar
                isActive={isCurrentTrack}
                percent={progressPercent}
                onClick={handleProgressClick}
            />

            {/* 4-я колонка: Пустой отступ (1fr из grid-template-columns) */}
            <div></div>

            {/* 5-я колонка: Дата добавления */}
            <span className={s.dateAdded}>{relativeDate}</span>

            {/* 6-я колонка: Кнопки действий (лайки) */}
            <div className={s.actions} onClick={(e) => e.stopPropagation()}>
                <ReactionActions
                    currentReaction={currentReaction}
                    likesCount={likesCount}
                    isLoading={isAnyActionLoading}
                    onLikeClick={handleLikeClick}
                    onDislikeClick={handleDislikeClick}
                />
            </div>

            {/* 7-я колонка: Время трека в самом конце */}
            <span className={s.timing}>{displayDuration}</span>
        </div>
    );
});

