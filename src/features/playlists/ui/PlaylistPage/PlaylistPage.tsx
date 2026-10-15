
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import {useNavigate, useParams} from 'react-router';
import {useDeletePlaylistMutation, useFetchPlaylistByIdQuery} from "@/features/playlists/api/playlists/playlistsApi.ts";
import { useFetchPlaylistTracksQuery } from "@/features/tracks/api/tracksApi.ts";
import { useDebounceValue } from "@/common/hooks";
import { TracksListRows } from "@/features/tracks/ui";
import { PlaylistPageSkeleton } from "@/features/playlists/ui/PlaylistPage/PlaylistPageSkeleton/PlaylistPageSkeleton.tsx";
import { useAudioPlayer } from "@/common/hooks";
import { useAppDispatch, useAppSelector } from "@/app/model/hooks.ts";
import { playTrack, togglePlay } from "@/app/model/playerSlice.ts";
import type { TrackItem } from "@/app/model/player.types.ts";

import { EditPlaylistForm } from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx";
import modalStyles from "@/common/components/Modal/Modal.module.css";

import { PlaylistHeader } from "@/features/playlists/ui/PlaylistPage/PlaylistHeader/PlaylistHeader.tsx";
import { PlaylistControls } from "@/features/playlists/ui/PlaylistPage/PlaylistControls/PlaylistControls.tsx";

import s from './PlaylistPage.module.css';
import {Modal} from "@/common/components/Modal/Modal.tsx";

export const PlaylistPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { isPlaying } = useAudioPlayer();
    const { currentTrackId } = useAppSelector(state => state.player);

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounceValue(searchQuery);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const [deletePlaylist] = useDeletePlaylistMutation();

    const { data: playlist, isLoading: isPlaylistLoading } = useFetchPlaylistByIdQuery(id || '', {
        skip: !id
    });

    const {
        data: tracksData,
        isLoading: isTracksLoading,
        isFetching
    } = useFetchPlaylistTracksQuery({
        playlistId: id || '',
        search: debouncedSearch
    }, { skip: !id });

    const tracks = tracksData?.data || [];
    const isFirstLoading = (isTracksLoading || isPlaylistLoading) && tracks.length === 0;

    if (isFirstLoading) {
        return <PlaylistPageSkeleton />;
    }

    if (!playlist?.data) {
        return (
            <div className={s.container}>
                <h2 className={s.errorText}>Playlist not found</h2>
            </div>
        );
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDeletePlaylist = async () => {
        if (confirm('Are you sure you want to delete this playlist?')) {
            try {
                // Вызываем мутацию удаления на бэкенде по ID текущего плейлиста
                await deletePlaylist(playlist.data.id).unwrap();
                // После успешного удаления перенаправляем пользователя на главную страницу плейлистов
                navigate('/playlists'); // Скорректируй роут на свой реальный (например '/' или '/playlists')
            } catch (error) {
                console.error("Ошибка при удалении плейлиста:", error);
            }
        }
    };

    const handlePlayPlaylist = () => {
        if (tracks.length === 0) return;

        const playerTracksList: TrackItem[] = tracks.map(track => {
            const { title, attachments, images, user } = track.attributes;
            return {
                id: track.id,
                url: attachments?.[0]?.url || '',
                data: {
                    title,
                    artistName: user?.name || 'Unknown Artist',
                    coverUrl: images?.main?.[0]?.url || ''
                }
            };
        });

        const isCurrentPlaylistActive = playerTracksList.some(item => item.id === currentTrackId);

        if (isCurrentPlaylistActive) {
            dispatch(togglePlay());
        } else {
            dispatch(playTrack({
                track: playerTracksList[0],
                tracksList: playerTracksList
            }));
        }
    };

    const isCurrentPlaylistPlayingAndActive = isPlaying && tracks.some(t => t.id === currentTrackId);

    return (
        <div className={s.container}>
            <PlaylistHeader playlist={playlist.data} tracks={tracks} />

            <PlaylistControls
                onDeleteClick={handleDeletePlaylist}
                playlistId={playlist.data.id}
                currentUserReaction={playlist.data.attributes.currentUserReaction}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                isSearching={isFetching}
                hasTracks={tracks.length > 0}
                isCurrentPlaylistPlayingAndActive={isCurrentPlaylistPlayingAndActive}
                onPlayPlaylist={handlePlayPlaylist}
                onEditClick={() => setIsEditOpen(true)} // Передаем триггер открытия
            />

            <div className={s.tracksSection}>
                {tracks.length > 0 ? (
                    <TracksListRows tracks={tracks} isLoading={isTracksLoading || isFetching} hideLikesCount={true} />
                ) : (
                    !isTracksLoading && (
                        <div className={s.emptyState}>
                            <p className={s.emptyText}>
                                {searchQuery ? 'No tracks found for your search.' : 'This playlist has no tracks yet.'}
                            </p>
                        </div>
                    )
                )}
            </div>

            {isEditOpen && (
                <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
                    <Modal.Header><h3>Edit playlist</h3></Modal.Header>
                    <Modal.Body>
                        <EditPlaylistForm
                            playlist={playlist.data}
                            onClose={() => setIsEditOpen(false)}
                            onLoadingChange={setIsFormSubmitting}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className={modalStyles.btnCancel}
                            onClick={() => setIsEditOpen(false)}
                            disabled={isFormSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="edit-playlist-form"
                            className={modalStyles.btnSave}
                            disabled={isFormSubmitting}
                        >
                            {isFormSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};
