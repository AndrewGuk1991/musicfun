import s from "./TrackInfo.module.css";

type TrackInfoProps = {
    coverUrl: string;
    title: string;
    artistName: string;
};

export const TrackInfo = ({ coverUrl, title, artistName }: TrackInfoProps) => (
    <div className={s.trackInfoBlock}>
        <img className={s.cover} src={coverUrl} alt="player cover" />
        <div className={s.textMeta}>
            <span className={s.title}>{title}</span>
            <span className={s.artist}>{artistName}</span>
        </div>
    </div>
);
