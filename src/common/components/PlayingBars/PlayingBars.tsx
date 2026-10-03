import s from "./TrackRow.module.css";

export const PlayingBars = () => {
    return (
        <div className={s.playingContainer}>
            <div className={s.bars}>
                <div className={s.bar}></div>
                <div className={s.bar}></div>
                <div className={s.bar}></div>
                <div className={s.bar}></div>
            </div>
        </div>
    );
};
