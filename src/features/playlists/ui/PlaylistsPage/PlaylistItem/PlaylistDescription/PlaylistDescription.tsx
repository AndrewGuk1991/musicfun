import type {PlaylistAttributes} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import s from './PlaylistDescription.module.css'
import {Icon} from "@/common/components";
import {useRelativeDate} from "@/common/utils";
import {useDislikePlaylistMutation, useLikePlaylistMutation} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {CurrentUserReaction} from "@/common/enums";


type Props = {
    attributes: PlaylistAttributes,
    playlistId: string,
}

export const PlaylistDescription = ({attributes, playlistId}: Props) => {

    const [likePlaylist, { isLoading: isLikeLoading }] = useLikePlaylistMutation();
    const [dislikePlaylist, { isLoading: isDislikeLoading }] = useDislikePlaylistMutation();

    const relativeDate = useRelativeDate(attributes.addedAt)

    const currentReaction = attributes.currentUserReaction ?? CurrentUserReaction.None

    const handleLikeClick = async () => {
        try {

            await likePlaylist(playlistId).unwrap();
        } catch (error) {
            console.error("Failed to toggle like status:", error);
        }
    };

    const handleDislikeClick = async () => {
        try {
            await dislikePlaylist(playlistId).unwrap();
        } catch (error) {
            console.error("Failed to toggle dislike status:", error);
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
                    disabled={isLikeLoading} // Защита от спама, пока идет запрос
                >
                    <Icon id={currentReaction === CurrentUserReaction.Like ? 'icon-like-filled' : 'icon-like'} />
                    <span className={s.likesCount}>{attributes.likesCount}</span>
                </button>

                <button
                    className={`${s.actionButton} ${currentReaction === CurrentUserReaction.Dislike ? s.active : ''}`}
                    type="button"
                    onClick={handleDislikeClick}
                    disabled={isDislikeLoading}
                >
                    <Icon id='icon-dislike' />
                </button>
            </div>
        </>
    )
}

