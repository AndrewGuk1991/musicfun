
import s from "./TrackInfo.module.css";
import defaultCover from '@/assets/images/default-playlist-cover.png'

type TrackInfoProps = {
    coverUrl: string;
    title: string;
    artistName: string;
};

export const TrackInfo = ({ coverUrl, title, artistName }: TrackInfoProps) => {
    const finalCoverUrl = coverUrl && coverUrl.trim() !== "" ? coverUrl : defaultCover;

    return (
        <div className={s.trackInfoBlock}>
            <div className={s.coverWrapper}>
                <img className={s.cover} src={finalCoverUrl} alt="player cover" />
            </div>

            <div className={s.textMeta}>
                {/* Контейнер для бегущей строки названия */}
                <div className={s.scrollContainer}>
                    <span className={s.title}>{title || 'No track selected'}</span>
                </div>

                {/* Контейнер для бегущей строки исполнителя */}
                <div className={s.scrollContainer}>
                    <span className={s.artist}>{artistName || 'Unknown Artist'}</span>
                </div>
            </div>
        </div>
    );
};
