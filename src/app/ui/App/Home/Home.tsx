import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {PlaylistsList} from "@/features/playlists/ui";
// import {useFetchLastTracksQuery} from "@/features/tracks/api/tracksApi.ts";
// import {TracksList} from "@/features/tracks/ui/TracksList/TracksList.tsx";
import s from './Home.module.css'
import {PlaylistSkeleton} from "@/common/components";


export const Home = () => {

    const {data, isLoading} = useFetchPlaylistsQuery({pageSize: 10})

    // const { data: tracksData } = useFetchLastTracksQuery({ pageSize: 10 });

    // const tracks = tracksData?.data || []

    return (
        <section className={s.home}>
            <div>
                <h2>New playlists</h2>
                {isLoading ? (
                    <div className={s.playlistsGrid}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <PlaylistSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <PlaylistsList playlists={data?.data || []} isPlaylistLoading={isLoading} />
                )}
            </div>
            <div>
                {/*<h2>New tracks</h2>*/}
                {/*<TracksList tracks={tracks}/>*/}
            </div>


        </section>
    )
}