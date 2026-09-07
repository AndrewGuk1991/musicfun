import {useGetMeQuery} from "@/features/auth/api/authApi.ts";
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {CreatePlaylistForm, PlaylistsList} from "@/features/playlists/ui";
import s from './ProfilePage.module.css'
import {Navigate} from "react-router";
import {Path} from "@/common/routing";

export const ProfilePage = () => {

    const {data: meResponse, isLoading: isMeLoading} = useGetMeQuery()


    const {data: playlistsResponse, isLoading} = useFetchPlaylistsQuery(
        {userId: meResponse?.userId},
        {skip: !meResponse?.userId}
    )

    if(isMeLoading || isLoading) return <h1>Skeleton loader ...</h1>

    if(!isMeLoading && !meResponse) return <Navigate to={Path.Playlists}/>

    return (
        <div>
            <h1>{meResponse?.login} page</h1>
            <div className={s.container}>
                <CreatePlaylistForm/>
                <PlaylistsList isPlaylistLoading={isLoading || isMeLoading} playlists={playlistsResponse?.data || []}/>
            </div>
        </div>
    )
}