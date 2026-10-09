import type {SortDirection} from "@/common/types/sort.ts";

export const getSortLabel = (sortBy: string, sortDirection: SortDirection): string => {
    if (sortBy === 'addedAt') {
        return sortDirection === 'desc' ? 'Newest first' : 'Oldest first';
    }
    if (sortBy === 'likesCount') {
        return 'Top-rated first';
    }

    return 'Sort by';
};
