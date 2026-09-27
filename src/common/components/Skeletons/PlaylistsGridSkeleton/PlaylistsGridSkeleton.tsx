
import { PlaylistSkeleton } from "@/common/components";
import s from './PlaylistsGridSkeleton.module.css'
type Props = {
    count?: number;
};

export const PlaylistsGridSkeleton = ({ count = 5 }: Props) => {
    return (
        <div className={s.playlistsGrid}>
            {Array.from({ length: count }).map((_, index) => (
                <PlaylistSkeleton key={index} />
            ))}
        </div>
    );
};
