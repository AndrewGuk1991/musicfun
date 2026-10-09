import type { SortOption } from "../SortDropdown/SortDropdown";
import type { AppSortField } from "@/common/types/sort.ts";

export const COMMON_SORT_OPTIONS: SortOption<AppSortField>[] = [
    { value: "addedAt", label: "Date added" },
    { value: "likesCount", label: "Top-rated first" },
];
