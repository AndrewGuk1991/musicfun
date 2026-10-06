import s from './TracksListRows.module.css';
import type { TrackData, TracksIncluded } from "@/features/tracks/api/tracksApi.types.ts";
import { TrackRow } from "@/features/tracks/ui/TracksLIstRows/TrackRow/TrackRow.tsx";
import { TracksListHeader } from "@/features/tracks/ui/TracksLIstRows/TracksListHeader/TracksListHeader.tsx";
import {useTracksQueueSync} from "@/features/tracks/hooks";

type TracksListRowsProps = {
    tracks: TrackData[];
    included?: TracksIncluded[];
    isLoading?: boolean;
};

export const TracksListRows = ({ tracks, included = [] }: TracksListRowsProps) => {
    // Выносим всю логику очередей и синхронизации в кастомный хук
    const { handlePlayTrack } = useTracksQueueSync({ tracks, included });

    return (
        <div className={s.tracksGrid}>
            <TracksListHeader />

            {tracks.map((track, index) => (
                <TrackRow
                    key={track.id}
                    index={index}
                    track={track}
                    included={included}
                    onPlay={handlePlayTrack}
                />
            ))}
        </div>
    );
};
