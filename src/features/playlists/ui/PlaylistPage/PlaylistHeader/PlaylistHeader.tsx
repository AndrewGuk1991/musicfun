
import type { PlaylistData } from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import type { TrackData } from "@/features/tracks/api/tracksApi.types.ts";
import { useRelativeDate } from "@/common/hooks";
import defaultCover from '@/assets/images/default-playlist-cover.png';

import s from './PlaylistHeader.module.css';

type PlaylistHeaderProps = {
    playlist: PlaylistData;
    tracks: TrackData[];
};

export const PlaylistHeader = ({ playlist, tracks }: PlaylistHeaderProps) => {
    const { title, user, images, description, tracksCount, addedAt } = playlist.attributes;
    const coverUrl = images?.main?.[0]?.url || defaultCover;
    const relativeDate = useRelativeDate(addedAt);

    const playlistArtists = tracks.reduce<string[]>((acc, track) => {
        const artistName = track.attributes.user?.name;
        if (artistName && artistName.trim() !== '' && !acc.includes(artistName)) {
            acc.push(artistName);
        }
        return acc;
    }, []);

    const displayArtists = playlistArtists.slice(0, 3);
    const hasMoreArtists = playlistArtists.length > 3;
    const artistsLabel = playlistArtists.length === 1 ? 'Artist: ' : 'Artists: ';

    return (
        <div className={s.header}>
            <div className={s.coverWrapper}>
                <img className={s.cover} src={coverUrl} alt={`${title} cover`} />
            </div>
            <div className={s.info}>
                <h2 className={s.title}>{title}</h2>
                <p className={s.description}>{description || 'No description'}</p>

                <p className={s.artists}>
                    {playlistArtists.length > 0 ? (
                        <>
                            <span className={s.artistsLabel}>{artistsLabel}</span>
                            <span className={s.artistsList}>{displayArtists.join(', ')}</span>
                            {hasMoreArtists && <span className={s.andMore}> and more</span>}
                        </>
                    ) : (
                        <span className={s.noArtists}>No artists information</span>
                    )}
                </p>

                <p className={s.metaInfo}>
                    <span className={s.madeFor}>Made for</span>
                    <span className={s.authorName}>{user?.name || 'Unknown'}</span>
                    <span className={s.separator}></span>
                    <span className={s.tracksCount}>{tracksCount} Tracks,</span>
                    <span className={s.relativeDate}>{addedAt ? relativeDate : '...'}</span>
                </p>
            </div>
        </div>
    );
};
