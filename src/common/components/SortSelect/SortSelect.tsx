import { useState } from "react";
import { Icon } from "@/common/components";
import { SortDropdown } from "./SortDropdown/SortDropdown";
import type { SortOption } from "./SortDropdown/SortDropdown";
import type { AppSortField, SortDirection } from "@/common/types/sort.ts";
import { useClickOutside } from "@/common/hooks";
import { getSortLabel } from "./lib/getSortLabel";

import s from "./SortSelect.module.css";

type SortSelectProps = {
    sortBy: AppSortField;
    sortDirection: SortDirection;
    options: SortOption<AppSortField>[];
    onSortChange: (sortBy: AppSortField, direction: SortDirection) => void;
    isLoading?: boolean;
};

export const SortSelect = ({ sortBy, sortDirection, options, onSortChange }: SortSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useClickOutside(() => setIsOpen(false));

    return (
        <div className={s.sortWrapper} ref={dropdownRef}>
            <span className={s.sortLabel}>Sort by</span>
            <button className={s.sortBtn} onClick={() => setIsOpen(!isOpen)} type="button">
                <span>{getSortLabel(sortBy, sortDirection)}</span>
                <Icon id="icon-arrow-down" width={14} height={7} viewBox="0 0 14 7" className={`${s.chevron} ${isOpen ? s.chevronOpen : ''}`} />
            </button>

            {isOpen && (
                <SortDropdown sortBy={sortBy} sortDirection={sortDirection} options={options} onSortChange={onSortChange} onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
};
