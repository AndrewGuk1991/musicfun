import { CurrentUserReaction } from "@/common/enums";
import type { CurrentUserReactionValue } from "@/common/types";
import { useReactionHandler } from "@/common/hooks";
import {
    useDislikeTrackMutation,
    useLikeTrackMutation,
    useRemoveReactionTrackMutation
} from "@/features/tracks/api/tracksApi.ts";
import type { TrackData } from "@/features/tracks/api/tracksApi.types.ts";

export const useTrackReactions = (track: TrackData) => {
    const [likeTrack, { isLoading: isLikeLoading }] = useLikeTrackMutation();
    const [dislikeTrack, { isLoading: isDislikeLoading }] = useDislikeTrackMutation();
    const [removeReactionTrack, { isLoading: isRemoveReactionLoading }] = useRemoveReactionTrackMutation();

    const currentReaction = (track.attributes.currentUserReaction ?? CurrentUserReaction.None) as CurrentUserReactionValue;
    const isAnyActionLoading = isLikeLoading || isDislikeLoading || isRemoveReactionLoading;

    const { handleLikeClick, handleDislikeClick } = useReactionHandler(track.id, currentReaction, {
        like: likeTrack,
        dislike: dislikeTrack,
        removeReaction: removeReactionTrack,
    });

    return {
        currentReaction,
        isAnyActionLoading,
        handleLikeClick,
        handleDislikeClick,
        likesCount: track.attributes.likesCount
    };
};
