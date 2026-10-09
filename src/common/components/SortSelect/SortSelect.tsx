import { useState } from "react";
import { Icon } from "@/common/components";
import { SortDropdown } from "@/common/components/SortSelect/SortDropdown/SortDropdown.tsx";
import type { SortOption } from "@/common/components/SortSelect/SortDropdown/SortDropdown.tsx";
import type { SortDirection } from "@/common/types/sort.ts";
import { useClickOutside } from "@/common/hooks"; // Твой родной хук
import { getSortLabel } from "./lib/getSortLabel";

import s from "./SortSelect.module.css";

type SortSelectProps<T extends string> = {
    sortBy: T;
    sortDirection: SortDirection;
    options: SortOption<T>[];
    onSortChange: (sortBy: T, direction: SortDirection) => void;
    isLoading?: boolean;
};

export const SortSelect = <T extends string,>({
                                                  sortBy,
                                                  sortDirection,
                                                  options,
                                                  onSortChange,
                                              }: SortSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useClickOutside(() => setIsOpen(false));

    return (
        /* Привязываем созданный хуком ref к контейнеру */
        <div className={s.sortWrapper} ref={dropdownRef}>
            <span className={s.sortLabel}>Sort by</span>
            <button
                className={s.sortBtn}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span>{getSortLabel(sortBy, sortDirection)}</span>

                <Icon
                    id="icon-arrow-down"
                    width={14}
                    height={7}
                    viewBox="0 0 14 7"
                    className={`${s.arrow} ${isOpen ? s.arrowOpen : ''}`}
                />
            </button>

            {isOpen && (
                <SortDropdown
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    options={options}
                    onSortChange={onSortChange}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};
