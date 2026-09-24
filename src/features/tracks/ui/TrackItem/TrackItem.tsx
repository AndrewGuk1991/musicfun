import type {TrackData, TracksIncluded} from "@/features/tracks/api/tracksApi.types.ts";
import s from './TrackItem.module.css'
import {ReactionActions} from "@/common/components";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import type {CurrentUserReactionValue} from "@/common/types";
import {CurrentUserReaction} from "@/common/enums";
import {useReactionHandler} from "@/common/hooks";
import {
    useDislikeTrackMutation,
    useLikeTrackMutation,
    useRemoveReactionTrackMutation
} from "@/features/tracks/api/tracksApi.ts";
import {truncateText} from "@/common/utils";

type Props = {
    track: TrackData
    included: TracksIncluded[]
}

export const TrackItem = ({track, included = []}: Props) => {

    const [likeTrack, { isLoading: isLikeLoading }] = useLikeTrackMutation();
    const [dislikeTrack, { isLoading: isDislikeLoading }] = useDislikeTrackMutation();
    const [removeReactionTrack, { isLoading: isRemoveReactionLoading }] = useRemoveReactionTrackMutation();

    const originalCover = track.attributes.images.main?.find(img => img.type === 'original')
    const src = originalCover?.url || defaultCover

    const currentReaction = (track.attributes.currentUserReaction ?? CurrentUserReaction.None) as CurrentUserReactionValue;
    const isAnyActionLoading = isLikeLoading || isDislikeLoading || isRemoveReactionLoading;

    const { handleLikeClick, handleDislikeClick } = useReactionHandler(track.id, currentReaction, {
        like: likeTrack,
        dislike: dislikeTrack,
        removeReaction: removeReactionTrack,
    });

    const artistId = track.relationships?.artists?.data?.[0]?.id;

    const artistData = included.find(item => item.id === artistId && item.type === 'artists');

    const artistName = artistData?.attributes?.name || "Unknown Artist"

    const truncatedTitle = truncateText(track.attributes.title, 30);

    return (
        <div className={s.item}>
            <img className={s.cover} src={src} alt="cover" />
            <p className={s.title}>{truncatedTitle}</p>
            <p className={s.artist}>{artistName}</p>
            <ReactionActions
                currentReaction={currentReaction}
                likesCount={track.attributes.likesCount}
                isLoading={isAnyActionLoading}
                onLikeClick={handleLikeClick}
                onDislikeClick={handleDislikeClick}/>
        </div>
    )
}