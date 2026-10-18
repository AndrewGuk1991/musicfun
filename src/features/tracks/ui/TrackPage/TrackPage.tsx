import {useParams} from 'react-router';
import {useFetchTrackByIdQuery} from "@/features/tracks/api/tracksApi.ts";
import s from './TrackPage.module.css'
import {TrackHeader} from "@/features/tracks/ui/TrackPage";
import {TrackControl} from "@/features/tracks/ui/TrackPage/TrackControl/TrackControl.tsx";

export const TrackPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: response, isLoading } = useFetchTrackByIdQuery(id ?? '', {
        skip: !id,
    });

    const track = response?.data;

    if (isLoading) return <div className={s.container}><h2>Loading track...</h2></div>;
    if (!track) return <div className={s.container}><h2>Track not found</h2></div>;

    return (
        <div className={s.container}>
            <TrackHeader track={track}/>
            <TrackControl track={track}/>
        </div>
    )
};