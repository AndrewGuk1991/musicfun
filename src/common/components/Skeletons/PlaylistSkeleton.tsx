import s from './PlaylistSkeleton.module.css'

export const PlaylistSkeleton = () => {
    return (
        <div className={s.container}>
            <div className={`${s.cover} ${s.pulse}`} />
            <div className={`${s.title} ${s.pulse}`} />
            <div className={`${s.description} ${s.pulse}`} />
            <div className={`${s.likes} ${s.pulse}`} />
            <div className={s.buttons}>
                <div className={`${s.button} ${s.pulse}`} />
                <div className={`${s.button} ${s.pulse}`} />
            </div>
        </div>
    )
}
