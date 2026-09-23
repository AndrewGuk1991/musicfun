import type { PlaylistAttributes } from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import s from './PlaylistDescription.module.css'
import {ReactionActions} from "@/common/components";
import { useRelativeDate } from "@/common/utils";
import {
    useDislikePlaylistMutation,
    useLikePlaylistMutation,
    useRemoveReactionPlaylistMutation
} from "@/features/playlists/api/playlists/playlistsApi.ts";
import { CurrentUserReaction } from "@/common/enums";

import type {CurrentUserReactionValue} from "@/common/types";
import {useReactionHandler} from "@/common/hooks";

type Props = {
    attributes: PlaylistAttributes,
    playlistId: string,
}

export const PlaylistDescription = ({ attributes, playlistId }: Props) => {
    const [likePlaylist, { isLoading: isLikeLoading }] = useLikePlaylistMutation();
    const [dislikePlaylist, { isLoading: isDislikeLoading }] = useDislikePlaylistMutation();
    const [removeReactionPlaylist, { isLoading: isRemoveReactionLoading }] = useRemoveReactionPlaylistMutation();

    const relativeDate = useRelativeDate(attributes.addedAt)

    // Приводим к типу CurrentUserReactionValue, используя значение из объекта
    const currentReaction = (attributes.currentUserReaction ?? CurrentUserReaction.None) as CurrentUserReactionValue;

    const isAnyActionLoading = isLikeLoading || isDislikeLoading || isRemoveReactionLoading;

    // Передаем id, текущую реакцию и методы мутаций в наш универсальный хук
    const { handleLikeClick, handleDislikeClick } = useReactionHandler(playlistId, currentReaction, {
        like: likePlaylist,
        dislike: dislikePlaylist,
        removeReaction: removeReactionPlaylist,
    });

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

            <ReactionActions
                currentReaction={currentReaction}
                likesCount={attributes.likesCount}
                isLoading={isAnyActionLoading}
                onLikeClick={handleLikeClick}
                onDislikeClick={handleDislikeClick}
            />
        </>
    )
}
