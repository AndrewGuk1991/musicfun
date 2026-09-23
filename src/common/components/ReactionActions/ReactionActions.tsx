import { memo } from 'react';
import { Icon } from "@/common/components";
import { CurrentUserReaction } from "@/common/enums";
import type { CurrentUserReactionValue } from "@/common/types";
import s from './ReactionActions.module.css';

type Props = {
    currentReaction: CurrentUserReactionValue;
    likesCount: number;
    isLoading: boolean;
    onLikeClick: () => void;
    onDislikeClick: () => void;
};

export const ReactionActions = memo(({
                                         currentReaction,
                                         likesCount,
                                         isLoading,
                                         onLikeClick,
                                         onDislikeClick,
                                     }: Props) => {
    return (
        <div className={s.actions}>
            <button
                className={`${s.actionButton} ${s.likeButtonWithCount} ${currentReaction === CurrentUserReaction.Like ? s.active : ''}`}
                type="button"
                onClick={onLikeClick}
                disabled={isLoading}
            >
                <Icon id={currentReaction === CurrentUserReaction.Like ? 'icon-like-filled' : 'icon-like'} />
                <span className={s.likesCount}>{likesCount}</span>
            </button>

            <button
                className={`${s.actionButton} ${currentReaction === CurrentUserReaction.Dislike ? s.active : ''}`}
                type="button"
                onClick={onDislikeClick}
                disabled={isLoading}
            >
                <Icon id='icon-dislike' />
            </button>
        </div>
    );
});

ReactionActions.displayName = 'ReactionActions';
