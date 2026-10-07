import s from "./TrackInfo.module.css";
import {truncateText} from "@/common/utils";

type TrackInfoProps = {
    coverUrl: string;
    title: string;
    artistName: string;
};

export const TrackInfo = ({ coverUrl, title, artistName }: TrackInfoProps) => {

    const truncatedTitle = truncateText(title, 30);

    return (
        <div className={s.trackInfoBlock}>
            <img className={s.cover} src={coverUrl} alt="player cover" />
            <div className={s.textMeta}>
                <span className={s.title}>{truncatedTitle}</span>
                <span className={s.artist}>{artistName}</span>
            </div>
        </div>
    )
};
