
import { Icon } from "@/common/components";
import s from './PlaylistsSort.module.css'

interface Props {
    sortDirection: "desc" | "asc";
    onToggleSort: () => void;
    isLoading?: boolean;
}

export const PlaylistsSort = ({ sortDirection, onToggleSort, isLoading }: Props) => {
    const isAscending = sortDirection === "asc";

    return (
        <div className={s.sortContainer}>
            <span className={s.sortLabel}>Sort by</span>
            <button
                className={s.sortButton}
                onClick={onToggleSort}
                type="button"
                disabled={isLoading}
            >
                <span>{isAscending ? "Oldest first" : "Newest first"}</span>
                <Icon
                    id="icon-arrow-down"
                    width={14}
                    height={7}
                    viewBox="0 0 14 7"
                    className={`${s.arrow} ${isAscending ? s.rotated : ""}`}
                />
            </button>
        </div>
    );
};
