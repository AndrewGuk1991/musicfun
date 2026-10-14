import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { SearchElement, Icon } from "@/common/components";
import { CurrentUserReaction } from "@/common/enums";
import type { CurrentUserReactionValue } from "@/common/types";
import { useReactionHandler } from "@/common/hooks";
import {
    useDislikePlaylistMutation,
    useLikePlaylistMutation,
    useRemoveReactionPlaylistMutation
} from "@/features/playlists/api/playlists/playlistsApi.ts";

import s from './PlaylistControls.module.css';

type PlaylistControlsProps = {
    playlistId: string;
    currentUserReaction: number;
    searchQuery: string;
    onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isSearching: boolean;
    hasTracks: boolean;
    isCurrentPlaylistPlayingAndActive: boolean;
    onPlayPlaylist: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
};

export const PlaylistControls = ({
                                     playlistId,
                                     currentUserReaction,
                                     searchQuery,
                                     onSearchChange,
                                     isSearching,
                                     hasTracks,
                                     isCurrentPlaylistPlayingAndActive,
                                     onPlayPlaylist,
                                     onEditClick,
                                     onDeleteClick // Деструктурируем новый проп
                                 }: PlaylistControlsProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [likePlaylist, { isLoading: isLikeLoading }] = useLikePlaylistMutation();
    const [dislikePlaylist, { isLoading: isDislikeLoading }] = useDislikePlaylistMutation();
    const [removeReactionPlaylist, { isLoading: isRemoveReactionLoading }] = useRemoveReactionPlaylistMutation();

    const currentPlaylistReaction = (currentUserReaction ?? CurrentUserReaction.None) as CurrentUserReactionValue;
    const isReactionLoading = isLikeLoading || isDislikeLoading || isRemoveReactionLoading;

    const { handleLikeClick, handleDislikeClick } = useReactionHandler(playlistId, currentPlaylistReaction, {
        like: likePlaylist,
        dislike: dislikePlaylist,
        removeReaction: removeReactionPlaylist,
    });

    return (
        <div className={s.searchWrapper}>
            <SearchElement
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search inside playlist"
                isLoading={isSearching}
            />

            {hasTracks && isCurrentPlaylistPlayingAndActive ? (
                <button className={s.playPauseBtn} onClick={onPlayPlaylist}>
                    <Icon id={'icon-btn-pause'} height={60} width={60} viewBox={'0 0 60 60'}/>
                </button>
            ) : (
                hasTracks && (
                    <button className={s.playPauseBtn} onClick={onPlayPlaylist}>
                        <Icon id={'icon-btn-play'} height={60} width={60} viewBox={'0 0 60 60'}/>
                    </button>
                )
            )}

            <button
                className={`${s.actionBtn} ${currentPlaylistReaction === CurrentUserReaction.Like ? s.activeLike : ''}`}
                onClick={handleLikeClick}
                disabled={isReactionLoading}
            >
                <Icon
                    id={currentPlaylistReaction === CurrentUserReaction.Like ? 'icon-like-filled' : 'icon-like'}
                    height={30}
                    width={30}
                    viewBox={'0 0 30 30'}
                />
            </button>

            <button
                className={`${s.actionBtn} ${currentPlaylistReaction === CurrentUserReaction.Dislike ? s.activeDislike : ''}`}
                onClick={handleDislikeClick}
                disabled={isReactionLoading}
            >
                <Icon id={'icon-dislike'} height={30} width={30} viewBox={'0 0 30 30'}/>
            </button>

            <div className={s.menuContainer} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span className={s.separator}></span>
                <span className={s.separator}></span>
                <span className={s.separator}></span>

                {isMenuOpen && (
                    <ul className={s.popupMenu} onClick={(e) => e.stopPropagation()}>
                        <li onClick={() => { onEditClick(); setIsMenuOpen(false); }}>
                            <Icon id={'icon-edit'} width={24} height={24} viewBox={'0 0 24 24'}/>
                            <span>Edit</span>
                        </li>
                        <li className={s.deleteOption} onClick={() => { onDeleteClick(); setIsMenuOpen(false); }}>
                            <Icon id={'icon-delete'} width={20} height={20} viewBox={'0 0 20 20'}/>
                            <span>Delete</span>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};
