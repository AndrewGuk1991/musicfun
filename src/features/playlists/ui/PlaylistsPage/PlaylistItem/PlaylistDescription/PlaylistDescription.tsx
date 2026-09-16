import type {PlaylistAttributes} from "@/features/playlists/api/playlists/playlistsApi.types.ts";
import s from './PlaylistDescription.module.css'

type Props = {
    attributes: PlaylistAttributes,
}

export const PlaylistDescription = ({attributes}: Props) => {
    const getRelativeDate = (dateString: string) => {
        const createdDate = new Date(dateString);
        const today = new Date();

        createdDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = createdDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "today";
        }

        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
        return rtf.format(diffDays, "day");
    };

    console.log(attributes)

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
                <span>Created {getRelativeDate(attributes.addedAt)}</span>
            </p>
        </>
    )
}