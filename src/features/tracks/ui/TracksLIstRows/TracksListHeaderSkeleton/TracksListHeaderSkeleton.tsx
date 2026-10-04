import s from "./TracksListHeaderSkeleton.module.css";

export const TracksListHeaderSkeleton = () => {
    return (
        <div className={s.headerSkeleton}>
            <div className={`${s.skeletonBlock} ${s.colIndex}`} />
            <div className={`${s.skeletonBlock} ${s.colTitle}`} />
            <div /> {/* Отступ под описание */}
            <div /> {/* Отступ после прогресс-бара */}
            <div className={`${s.skeletonBlock} ${s.dateAddedHeader}`} />
            <div /> {/* Место над кнопками экшенов */}
            <div className={s.colDuration}>
                <div className={`${s.skeletonBlock} ${s.clock}`} />
            </div>
        </div>
    );
};
