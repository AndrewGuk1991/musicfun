
import s from './TrackSkeleton.module.css'

export const TrackSkeleton = () => {
    return (
        <div className={s.container}>
            <div className={`${s.cover} ${s.pulse}`} />

            <div className={s.info}>
                <div className={`${s.title} ${s.pulse}`} />
                <div className={`${s.artist} ${s.pulse}`} />
            </div>

            <div className={s.actions}>
                <div className={`${s.actionButton} ${s.pulse}`} />
                <div className={`${s.actionButton} ${s.pulse}`} />
            </div>
        </div>
    )
}
