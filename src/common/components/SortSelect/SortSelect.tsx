
import { Icon } from "@/common/components";
import s from './SortSelect.module.css';

export type SortDirection = "asc" | "desc";

export type SortOption<T extends string> = {
    value: T;
    label: string;
};

type Props<T extends string> = {
    sortBy: T;
    sortDirection: SortDirection;
    options: SortOption<T>[];
    onSortChange: (sortBy: T, direction: SortDirection) => void;
    isLoading?: boolean;
};

export const SortSelect = <T extends string>({
                                                 sortBy,
                                                 sortDirection,
                                                 options,
                                                 onSortChange,
                                                 isLoading
                                             }: Props<T>) => {
    const isAscending = sortDirection === "asc";
    const currentOption = options.find(opt => opt.value === sortBy) || options[0];

    const handleToggleDirection = () => {
        const nextDirection = isAscending ? "desc" : "asc";
        onSortChange(sortBy, nextDirection);
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value as T, sortDirection);
    };

    return (
        <div className={s.sortContainer}>
            <span className={s.sortLabel}>Sort by</span>

            <div className={s.selectWrapper}>
                <select
                    className={s.nativeSelect}
                    value={sortBy}
                    onChange={handleFieldChange}
                    disabled={isLoading}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <span className={s.selectTrigger}>{currentOption?.label}</span>
            </div>

            <button
                className={s.sortButton}
                onClick={handleToggleDirection}
                type="button"
                disabled={isLoading}
                title={isAscending ? "Ascending" : "Descending"}
            >
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
