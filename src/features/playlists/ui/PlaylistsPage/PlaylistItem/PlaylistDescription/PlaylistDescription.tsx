import type {PlaylistAttributes} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import s from './PlaylistDescription.module.css'
import {Icon} from "@/common/components";
import {useRelativeDate} from "@/common/utils";
import {
    useDislikePlaylistMutation,
    useLikePlaylistMutation,
    useRemoveReactionPlaylistMutation
} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {CurrentUserReaction} from "@/common/enums";


type Props = {
    attributes: PlaylistAttributes,
    playlistId: string,
}

export const PlaylistDescription = ({attributes, playlistId}: Props) => {

    const [likePlaylist, { isLoading: isLikeLoading }] = useLikePlaylistMutation();
    const [dislikePlaylist, { isLoading: isDislikeLoading }] = useDislikePlaylistMutation();
    const [removeReactionPlaylist, { isLoading: isRemoveReactionLoading }] = useRemoveReactionPlaylistMutation();

    const relativeDate = useRelativeDate(attributes.addedAt)

    const currentReaction = attributes.currentUserReaction ?? CurrentUserReaction.None

    const isAnyActionLoading = isLikeLoading || isDislikeLoading || isRemoveReactionLoading;

    const handleLikeClick = async () => {
        try {
            // Если лайк уже нажат, отправляем противоположный запрос — дизлайк
            if (currentReaction === CurrentUserReaction.Like) {
                await removeReactionPlaylist(playlistId).unwrap();
            } else {
                await likePlaylist(playlistId).unwrap();
            }
        } catch (error) {
            console.error("Failed to toggle reaction status:", error);
        }
    };

    const handleDislikeClick = async () => {
        try {
            // Если дизлайк уже нажат, отправляем противоположный запрос — лайк
            if (currentReaction === CurrentUserReaction.Dislike) {
                await removeReactionPlaylist(playlistId).unwrap();
            } else {
                await dislikePlaylist(playlistId).unwrap();
            }
        } catch (error) {
            console.error("Failed to toggle reaction status:", error);
        }
    };

    return (
        <>
            <p>{attributes.title}</p>
            <p>
                Made for
                <span className={s.userName}>{attributes.user.name}</span>
            </p>
            <p className={s.metaInfo}>
                <span>{attributes.tracksCount} Tracks</span>
                <span className={s.separator}>&bull;</span>
                <span>Created {relativeDate}</span>
            </p>

            <div className={s.actions}>
                <button
                    className={`${s.actionButton} ${s.likeButtonWithCount} ${currentReaction === CurrentUserReaction.Like ? s.active : ''}`}
                    type="button"
                    onClick={handleLikeClick}
                    disabled={isAnyActionLoading}
                >
                    <Icon id={currentReaction === CurrentUserReaction.Like ? 'icon-like-filled' : 'icon-like'} />
                    <span className={s.likesCount}>{attributes.likesCount}</span>
                </button>

                <button
                    className={`${s.actionButton} ${currentReaction === CurrentUserReaction.Dislike ? s.active : ''}`}
                    type="button"
                    onClick={handleDislikeClick}
                    disabled={isAnyActionLoading}
                >
                    <Icon id='icon-dislike' />
                </button>
            </div>
        </>
    )
}

