import {useEffect, useState} from 'react';
import type { MouseEvent } from 'react';
import {useDispatch, useSelector} from 'react-redux';

import type {TrackData, TracksIncluded} from "@/features/tracks/api/tracksApi.types.ts";
import {
    useDislikeTrackMutation,
    useLikeTrackMutation,
    useRemoveReactionTrackMutation
} from "@/features/tracks/api/tracksApi.ts";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import {CurrentUserReaction} from "@/common/enums";
import type {CurrentUserReactionValue} from "@/common/types";
import {useReactionHandler} from "@/common/hooks";
import {truncateText, useRelativeDate} from "@/common/utils";
import {ReactionActions} from "@/common/components";

import s from "./TrackRow.module.css";
import type {RootState} from "@/app/model/store.ts";
import {pauseTrack, playTrack} from "@/features/tracks/model/playerSlice.ts";

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

type Props = {
    track: TrackData;
    index: number;
    included?: TracksIncluded[];
};

export const TrackRow = ({ track, index, included = [] }: Props) => {
    const [likeTrack, { isLoading: isLikeLoading }] = useLikeTrackMutation();
    const [dislikeTrack, { isLoading: isDislikeLoading }] = useDislikeTrackMutation();
    const [removeReactionTrack, { isLoading: isRemoveReactionLoading }] = useRemoveReactionTrackMutation();

    const dispatch = useDispatch();
    const { currentTrackId, isPlaying } = useSelector((state: RootState) => state.player);

    const isCurrentTrack = currentTrackId === track.id;
    const isTrackPlayingNow = isCurrentTrack && isPlaying;

    const [localCurrentTime, setLocalCurrentTime] = useState(0);
    const [localDuration, setLocalDuration] = useState(0);

    const thumbnailCover = track.attributes.images.main?.find((img) => img.type === "thumbnail");
    const src = thumbnailCover?.url || defaultCover;

    const currentReaction = (track.attributes.currentUserReaction ?? CurrentUserReaction.None) as CurrentUserReactionValue;
    const isAnyActionLoading = isLikeLoading || isDislikeLoading || isRemoveReactionLoading;

    const { handleLikeClick, handleDislikeClick } = useReactionHandler(track.id, currentReaction, {
        like: likeTrack,
        dislike: dislikeTrack,
        removeReaction: removeReactionTrack,
    });

    const artistId = track.relationships?.artists?.data?.[0]?.id;
    const artistData = included.find((item) => item.id === artistId && item.type === "artists");
    const artistName = artistData?.attributes?.name || "Unknown Artist";

    const truncatedTitle = truncateText(track.attributes.title, 30);
    const rawDateString = track.attributes.addedAt || "";
    const relativeDate = useRelativeDate(rawDateString);

    const audioAttachment = track.attributes.attachments?.find(
        (file) => file.contentType.startsWith("audio/") || file.url.endsWith(".mp3")
    ) || track.attributes.attachments?.[0];

    const audioUrl = audioAttachment?.url || "";

    useEffect(() => {
        if (!isCurrentTrack) {
            setLocalCurrentTime(0);
            setLocalDuration(0);
            return;
        }

        const audio = (document.getElementById('global-audio') || document.querySelector('audio')) as HTMLAudioElement | null;
        if (!audio) return;

        const updateProgress = () => {
            setLocalCurrentTime(audio.currentTime);
            if (audio.duration && !isNaN(audio.duration)) {
                setLocalDuration(audio.duration);
            }
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);
        audio.addEventListener('durationchange', updateProgress);

        updateProgress();

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
            audio.removeEventListener('durationchange', updateProgress);
        };
    }, [isCurrentTrack, isPlaying, audioUrl]);

    const progressPercent = localDuration > 0 ? (localCurrentTime / localDuration) * 100 : 0;

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
                    coverUrl: src
                }
            }));
        }
    };

    const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isCurrentTrack) return;

        const audio = document.getElementById('global-audio') as HTMLAudioElement | null;
        if (!audio || !localDuration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercent = clickX / rect.width;

        audio.currentTime = clickPercent * localDuration;
    };

    return (
        <div className={`${s.item} ${isCurrentTrack ? s.activeItem : ''}`}>

            {/* 1-я колонка: Описание (Номер/Плеер + Обложка + Название) */}
            <div className={s.description} onClick={handlePlayToggle}>
                {isTrackPlayingNow ? (
                    <div className={s.playingContainer}>
                        <div className={s.bars}>
                            <div className={s.bar}></div>
                            <div className={s.bar}></div>
                            <div className={s.bar}></div>
                            <div className={s.bar}></div>
                        </div>
                    </div>
                ) : (
                    <span className={`${s.number} ${isCurrentTrack ? s.activeNumber : ''}`}>
                        {index + 1}
                    </span>
                )}

                <img className={s.cover} src={src} alt="cover" />
                <div className={s.info}>
                    <span className={`${s.title} ${isCurrentTrack ? s.activeTitle : ''}`}>{truncatedTitle}</span>
                    <span className={s.artist}>{artistName}</span>
                </div>
            </div>

            {/* 2-я колонка: Пустой отступ */}
            <div></div>

            {/* 3-я колонка: Полоска воспроизведения */}
            <div
                className={`${s.progressBarContainer} ${isCurrentTrack ? s.progressBarActive : ''}`}
                onClick={handleProgressClick}
            >
                <div
                    className={s.progressBarFill}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* 4-я колонка: Пустой отступ */}
            <div></div>

            {/* 5-я колонка: Дата добавления */}
            <span className={s.dateAdded}>{relativeDate}</span>

            {/* 6-я колонка: Кнопки действий (лайки) */}
            <div className={s.actions} onClick={(e) => e.stopPropagation()}>
                <ReactionActions
                    currentReaction={currentReaction}
                    likesCount={track.attributes.likesCount}
                    isLoading={isAnyActionLoading}
                    onLikeClick={handleLikeClick}
                    onDislikeClick={handleDislikeClick}
                />
            </div>

            {/* 7-я колонка: Время (в самом конце строки под часами) */}
            <span className={s.timing}>{displayDuration}</span>
        </div>
    );
};
