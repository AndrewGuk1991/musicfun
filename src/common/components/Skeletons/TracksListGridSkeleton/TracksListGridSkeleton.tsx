import { TrackSkeleton } from "@/common/components";
import s from './TracksListGridSkeleton.module.css';

type Props = {
    count?: number;
};

export const TracksListGridSkeleton = ({ count = 10 }: Props) => {
    return (
        <div className={s.tracksListGrid}>
            {Array.from({ length: count }).map((_, index) => (
                <TrackSkeleton key={index} />
            ))}
        </div>
    );
};
