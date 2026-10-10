import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlists/playlistsApi.ts";
import { useFetchLastTracksQuery } from "@/features/tracks/api/tracksApi.ts";
import { TracksList } from "@/features/tracks/ui/TracksList/TracksList.tsx";
import s from './Home.module.css';
import {PlaylistsList} from "@/features/playlists/ui/PlaylistsPage";

export const Home = () => {
    const { data: playlistsData, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery({ pageSize: 5 });
    const { data: tracksData, isLoading: isTracksLoading } = useFetchLastTracksQuery({ pageSize: 10 });

    const playlists = playlistsData?.data || [];
    const tracks = tracksData?.data || [];
    const included = tracksData?.included || [];

    const showPlaylistsHeader = isPlaylistsLoading || playlists.length > 0;
    const showTracksHeader = isTracksLoading || tracks.length > 0;

    return (
        <section className={s.home}>
            {/* Блок плейлистов */}
            {showPlaylistsHeader && <h2 className={s.title}>New playlists</h2>}
            <PlaylistsList playlists={playlists} isLoading={isPlaylistsLoading}/>

            {/* Блок треков */}
            {showTracksHeader && <h2 className={s.title}>New tracks</h2>}
            <TracksList tracks={tracks} included={included} isLoading={isTracksLoading} />
        </section>
    );
};
