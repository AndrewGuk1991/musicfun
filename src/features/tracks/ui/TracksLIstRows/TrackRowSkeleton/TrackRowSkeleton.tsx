import s from "./TrackRowSkeleton.module.css";

export const TrackRowSkeleton = () => {
    return (
        <div className={s.skeletonItem}>
            {/* 1-я колонка: Описание (Номер + Обложка + Тексты) */}
            <div className={s.description}>
                <div className={`${s.skeletonBlock} ${s.number}`} />
                <div className={`${s.skeletonBlock} ${s.cover}`} />
                <div className={s.info}>
                    <div className={`${s.skeletonBlock} ${s.title}`} />
                    <div className={`${s.skeletonBlock} ${s.artist}`} />
                </div>
            </div>

            {/* 2-я колонка: Пустой отступ (1fr) */}
            <div />

            {/* 3-я колонка: Прогресс-бар */}
            <div className={`${s.skeletonBlock} ${s.progressBar}`} />

            {/* 4-я колонка: Пустой отступ (1fr) */}
            <div />

            {/* 5-я колонка: Дата добавления */}
            <div className={`${s.skeletonBlock} ${s.dateAdded}`} />

            {/* 6-я колонка: Действия (Лайк) */}
            <div className={`${s.skeletonBlock} ${s.actions}`} />

            {/* 7-я колонка: Время (внутри контейнера для выравнивания вправо) */}
            <div className={s.timingContainer}>
                <div className={`${s.skeletonBlock} ${s.timing}`} />
            </div>
        </div>
    );
};
