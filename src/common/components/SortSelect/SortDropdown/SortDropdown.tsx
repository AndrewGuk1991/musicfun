import s from './SortDropdown.module.css';
import type { AppSortField, SortDirection } from "@/common/types/sort.ts";

export type SortOption<T extends string> = {
    value: T;
    label: string;
};

type SortDropdownProps = {
    sortBy: AppSortField; // Используем фиксированный тип
    sortDirection: SortDirection;
    options: SortOption<AppSortField>[];
    onSortChange: (sortBy: AppSortField, direction: SortDirection) => void;
    onClose: () => void;
};

export const SortDropdown = ({ sortBy, sortDirection, options, onSortChange, onClose }: SortDropdownProps) => {
    return (
        <ul className={s.dropdownMenu}>
            {options.map((option) => {
                const isNewestActive = option.value === 'addedAt' && sortBy === 'addedAt' && sortDirection === 'desc';
                const isOldestActive = option.value === 'addedAt' && sortBy === 'addedAt' && sortDirection === 'asc';
                const isPopularActive = option.value === 'likesCount' && sortBy === 'likesCount';

                return (
                    <div key={option.value} className={s.dropdownGroup}>
                        {option.value === 'addedAt' ? (
                            <>
                                <li onClick={() => { onSortChange(option.value, 'desc'); onClose(); }} className={isNewestActive ? s.activeItem : ''}>
                                    <span>Newest first</span>
                                </li>
                                <li onClick={() => { onSortChange(option.value, 'asc'); onClose(); }} className={isOldestActive ? s.activeItem : ''}>
                                    <span>Oldest first</span>
                                </li>
                            </>
                        ) : (
                            <li onClick={() => { onSortChange(option.value, 'desc'); onClose(); }} className={isPopularActive ? s.activeItem : ''}>
                                <span>{option.label}</span>
                            </li>
                        )}
                    </div>
                );
            })}
        </ul>
    );
};

