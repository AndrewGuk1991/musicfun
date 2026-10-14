import s from './PlaylistsList.module.css'
import {useMemo} from "react";
import type {PlaylistData} from "@/features/playlists/api/playlists/playlistsApi.types.ts";

import {PlaylistsGridSkeleton} from "@/common/components/Skeletons/PlaylistsGridSkeleton/PlaylistsGridSkeleton.tsx";
import {PlaylistCard} from "../PlaylistCard/PlaylistCard.tsx";

type Props = {
    playlists: PlaylistData[]
    isLoading: boolean
    countSkeleton?: number
}

export const PlaylistsList = ({ playlists, isLoading, countSkeleton }: Props) => {

    const uniquePlaylists = useMemo(() => {
        return playlists.filter(
            (playlist, index, self) => self.findIndex((p) => p.id === playlist.id) === index
        )
    }, [playlists])


    if (isLoading) return <PlaylistsGridSkeleton count={countSkeleton || 5} />


    if (!uniquePlaylists.length) return <h2 >Playlists not found</h2>

    return (
        <div>
            <div className={s.items}>
                {uniquePlaylists.map((playlist) => (
                        <PlaylistCard
                            key={playlist.id}
                            playlist={playlist}
                        />
                ))}

            </div>
        </div>
    )
}
