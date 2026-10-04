import React from 'react';
import s from './TracksListHeader.module.css';

export const TracksListHeader = React.memo(() => {
    return (
        <div className={s.tracksHeader}>
            <div className={s.colIndex}>#</div>
            <div className={s.colTitle}>TITLE</div>
            <div></div> {/* Описание */}
            <div></div> {/* Отступ после прогресс-бара */}
            <div className={s.dateAddedHeader}>DATE ADDED</div>
            <div></div> {/* Место над кнопками экшенов (размер auto) */}

            <div className={s.colDuration}>
                <div className={s.cssClock} title="Длительность"></div>
            </div>
        </div>
    );
});