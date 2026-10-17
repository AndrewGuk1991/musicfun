import defaultCover from '@/assets/images/default-playlist-cover.png';

import s from './TrackHeader.module.css';
import type {TrackData} from "@/features/tracks/api/tracksApi.types.ts";
import {formatEUPDate} from "@/common/utils";

type TrackHeaderProps = {
    track?: TrackData;
};

export const TrackHeader = ({track}: TrackHeaderProps) => {
    if (!track) return null;

    const {
        title,
        user,
        images,
        publishedAt,
    } = track.attributes;

    const coverUrl = images?.main?.[0]?.url || defaultCover;
    const displayDate = formatEUPDate(publishedAt);

    return (
        <div className={s.header}>
            <div className={s.coverWrapper}>
                <img className={s.cover} src={coverUrl} alt={`${title} cover`}/>
            </div>

            <div className={s.info}>
                <h2 className={s.title}>{title}</h2>

                <p className={s.metaInfo}>
                    <span className={s.artistName}>{user?.name || 'Unknown Artist'}</span>
                    <span className={s.releaseDate}>
                        <span>Release date  </span>
                        <span>{displayDate}</span>
                    </span>
                </p>
            </div>
        </div>
    );
};
