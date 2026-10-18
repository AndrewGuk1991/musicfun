import {memo} from 'react';
import {Icon} from "@/common/components";
import {CurrentUserReaction} from "@/common/enums";
import type {CurrentUserReactionValue} from "@/common/types";
import s from './ReactionActions.module.css';

type Props = {
    currentReaction: CurrentUserReactionValue;
    likesCount: number;
    isLoading: boolean;
    onLikeClick: () => void;
    onDislikeClick: () => void;
    hideLikesCount?: boolean
    widthLike?: number
    heightLike?: number
    widthDislike?: number
    heightDislike?: number
    viewBox?: string
};

export const ReactionActions = memo(({
                                         currentReaction,
                                         likesCount,
                                         isLoading,
                                         onLikeClick,
                                         onDislikeClick,
                                         hideLikesCount = false,
                                         widthDislike,
                                         heightLike,
                                         heightDislike,
                                         widthLike,
                                         viewBox
                                     }: Props) => {
    return (
        <div className={s.actions}>
            <button
                className={`${s.actionButton} ${!hideLikesCount ? s.likeButtonWithCount : ''} ${currentReaction === CurrentUserReaction.Like ? s.active : ''}`}
                type="button"
                onClick={onLikeClick}
                disabled={isLoading}
            >
                <Icon id={currentReaction === CurrentUserReaction.Like ? 'icon-like-filled' : 'icon-like'}
                      width={widthLike}
                      height={heightLike}
                      viewBox={viewBox}
                />
                <span className={`${s.likesCount} ${hideLikesCount ? s.hidden : ''}`}>
                    {likesCount}
                </span>
            </button>

            <button
                className={`${s.actionButton} ${currentReaction === CurrentUserReaction.Dislike ? s.active : ''}`}
                type="button"
                onClick={onDislikeClick}
                disabled={isLoading}
            >
                <Icon id='icon-dislike'
                      width={widthDislike}
                      height={heightDislike}
                      viewBox={viewBox}
                />
            </button>
        </div>
    );
});

