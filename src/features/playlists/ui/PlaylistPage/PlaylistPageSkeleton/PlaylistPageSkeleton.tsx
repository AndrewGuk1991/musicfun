import { TracksListHeaderSkeleton } from "@/features/tracks/ui/TracksLIstRows";
import { TrackRowSkeleton } from "@/features/tracks/ui/TracksLIstRows/TrackRowSkeleton/TrackRowSkeleton.tsx";
import defaultCover from '@/assets/images/default-playlist-cover.png';

import sk from './PlaylistPageSkeleton.module.css';

export const PlaylistPageSkeleton = () => {
    return (
        <div className={sk.container}>

            <div className={sk.header}>
                <div className={`${sk.coverWrapper} ${sk.pulse}`}>
                    <img className={sk.cover} src={defaultCover} alt="loading cover" style={{ opacity: 0.2 }} />
                </div>
                <div className={sk.info}>
                    <div className={`${sk.skeletonLine} ${sk.titleSkeleton} ${sk.pulse}`} />
                    <div className={`${sk.skeletonLine} ${sk.descSkeleton} ${sk.pulse}`} />
                    <div className={`${sk.skeletonLine} ${sk.metaSkeleton} ${sk.pulse}`} />
                </div>
            </div>

            <div className={sk.searchWrapper}>
                <div className={`${sk.searchSkeleton} ${sk.pulse}`} />
            </div>

            <div className={sk.tracksSection}>
                <TracksListHeaderSkeleton />
                {Array.from({ length: 5 }).map((_, index) => (
                    <TrackRowSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};
