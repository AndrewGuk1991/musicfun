// src/features/tracks/ui/TrackPage/TrackControl/TrackControl.tsx
import { useDispatch, useSelector } from 'react-redux';
import {MediaPlayButton, ReactionActions, TrackEllipsisButton} from "@/common/components";
import { useTrackReactions } from "@/common/hooks";
import { playTrack, togglePlay } from "@/app/model/playerSlice.ts";
import type { RootState } from "@/app/model/store.ts";
import type { TrackData } from "@/features/tracks/api/tracksApi.types.ts";
import type { TrackItem } from "@/app/model/player.types.ts";

import s from './TrackControl.module.css';

type Props = {
    track: TrackData;
};

export const TrackControl = ({ track }: Props) => {
    const dispatch = useDispatch();

    // 1. Получаем состояние из глобального Redux-стора плеера
    const currentTrackId = useSelector((state: RootState) => state.player.currentTrackId);
    const isPlaying = useSelector((state: RootState) => state.player.isPlaying);

    // Проверяем, активен ли этот трек в плеере прямо сейчас
    const isCurrentTrackActive = currentTrackId === track.id;
    const isTrackPlayingNow = isCurrentTrackActive && isPlaying;

    // 2. Подключаем хук реакций (лайков/дизлайков) для этого конкретного трека
    const {
        currentReaction,
        isAnyActionLoading,
        handleLikeClick,
        handleDislikeClick,
        likesCount
    } = useTrackReactions(track);

    // 3. Логика клика по большой кнопке воспроизведения
    const handlePlayToggle = () => {
        if (isCurrentTrackActive) {
            // Если трек уже загружен в плеер — просто переключаем состояние плей/пауза
            dispatch(togglePlay());
        } else {
            // Если играет другая песня или плеер пуст — маппим и загружаем этот сингл
            const { title, attachments, images, user } = track.attributes;

            const playerTrackItem: TrackItem = {
                id: track.id,
                url: attachments?.[0]?.url || '',
                data: {
                    title,
                    artistName: user?.name || 'Unknown Artist',
                    coverUrl: images?.main?.[0]?.url || ''
                }
            };

            dispatch(playTrack({
                track: playerTrackItem,
                tracksList: [playerTrackItem] // Передаем его же единственным элементом в очередь
            }));
        }
    };

    return (
        <div className={s.container}>

            <MediaPlayButton
                isPlaying={isTrackPlayingNow}
                onToggle={handlePlayToggle}
                size={60}
            />

            <ReactionActions
                currentReaction={currentReaction}
                likesCount={likesCount || 0}
                isLoading={isAnyActionLoading}
                onLikeClick={handleLikeClick}
                onDislikeClick={handleDislikeClick}
                widthLike={34}
                heightLike={31}
                widthDislike={32}
                heightDislike={30}
                viewBox={'0 0 40 40'}
            />

            <TrackEllipsisButton handleTrack={() => {}}/>
        </div>
    );
};
