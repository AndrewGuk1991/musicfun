import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from "./TrackRow.module.css";
import type {RootState} from "@/app/model/store.ts";
import {useTrackAudioProgress, useTrackMetadata, useTrackReactions} from "@/common/hooks";
import {formatDuration} from "@/common/utils";
import {pauseTrack, playTrack} from "@/features/tracks/model/playerSlice.ts";
import {PlayingBars, ReactionActions, TrackProgressBar} from "@/common/components";
import type {TrackData, TracksIncluded} from "@/features/tracks/api/tracksApi.types.ts";

type Props = {
    track: TrackData;
    index: number;
    included?: TracksIncluded[];
};

export const TrackRow = React.memo(({ track, index, included = [] }: Props) => {
    const dispatch = useDispatch();
    const { currentTrackId, isPlaying } = useSelector((state: RootState) => state.player);

    const isCurrentTrack = currentTrackId === track.id;
    const isTrackPlayingNow = isCurrentTrack && isPlaying;

    // 1. Парсинг метаданных трека
    const { coverSrc, artistName, truncatedTitle, relativeDate, audioUrl } = useTrackMetadata(track, included);

    // 2. Логика синхронизации времени и прогресс-бара
    const { duration: localDuration, progressPercent, handleProgressClick } = useTrackAudioProgress(isCurrentTrack, audioUrl);

    // 3. Логика лайков/дизлайков и обращений к API
    const { currentReaction, isAnyActionLoading, handleLikeClick, handleDislikeClick, likesCount } = useTrackReactions(track);

    // Вычисление итоговой длительности для вывода на экран
    const displayDuration = isCurrentTrack && localDuration > 0
        ? formatDuration(localDuration)
        : formatDuration(track.attributes.duration || 0);

    const handlePlayToggle = () => {
        if (isTrackPlayingNow) {
            dispatch(pauseTrack());
        } else {
            dispatch(playTrack({
                id: track.id,
                url: audioUrl,
                data: {
                    title: track.attributes.title,
                    artistName: artistName,
                    coverUrl: coverSrc
                }
            }));
        }
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

