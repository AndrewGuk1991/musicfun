import type {PlaylistAttributes} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import s from './PlaylistDescription.module.css'
import {Icon} from "@/common/components";
import {useRelativeDate} from "@/common/utils";


type Props = {
    attributes: PlaylistAttributes,
}

export const PlaylistDescription = ({attributes}: Props) => {



    const relativeDate = useRelativeDate(attributes.addedAt)

    return (
        <>
            <p>{attributes.title}</p>
            <p>
                Made for
                <span className={s.userName}>{attributes.user.name}</span>
            </p>
            <p className={s.metaInfo}>
                <span>{attributes.tracksCount} Tracks</span>
                <span className={s.separator}>&bull;</span>
                <span>Created {relativeDate}</span>
            </p>

            <div className={s.actions}>
                <button className={`${s.actionButton} ${s.likeButtonWithCount}`} type="button">
                    <Icon id='icon-like' />
                    <span className={s.likesCount}>{attributes.likesCount}</span>
                </button>
                <button className={s.actionButton} type="button">
                    <Icon id='icon-dislike' />
                </button>
            </div>
        </>
    )
}

