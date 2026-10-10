import { useState } from "react";
import { useFetchTracksInfiniteQuery } from "@/features/tracks/api/tracksApi.ts";
import { useDebounceValue, useInfiniteScroll } from "@/common/hooks";
import { SearchElement, SortSelect } from "@/common/components";
import { TracksListRows } from "@/features/tracks/ui";
import { LoadingTrigger, TracksListHeaderSkeleton } from "@/features/tracks/ui/TracksLIstRows";
import { TrackRowSkeleton } from "@/features/tracks/ui/TracksLIstRows/TrackRowSkeleton/TrackRowSkeleton.tsx";

import s from './TracksPage.module.css';
import type {AppSortField, SortDirection} from "@/common/types/sort.ts";
import {COMMON_SORT_OPTIONS} from "@/common/components/SortSelect/config/sortOptions.ts";

export const TracksPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [sortBy, setSortBy] = useState<AppSortField>("addedAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const debouncedSearch = useDebounceValue(searchQuery);

    // Отправляем поисковую строку и параметры сортировки в кэш API-пагинации
    const { data, hasNextPage, isLoading, isFetching, isFetchingNextPage, fetchNextPage } =
        useFetchTracksInfiniteQuery(
            { search: debouncedSearch, sortBy, sortDirection });

    const { observerRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetching });

    const pages = data?.pages.flatMap((page) => page.data) || [];

    const isTotalEmpty = !isLoading && pages.length === 0 && !searchQuery;
    const isSearchEmpty = !isLoading && pages.length === 0 && searchQuery;

    const handleSortChange = (newSortBy: AppSortField, newDirection: SortDirection) => {
        setSortBy(newSortBy);
        setSortDirection(newDirection);
    };

    return (
        <div className={s.container}>

            {!isTotalEmpty && <h2 className={s.title}>All Tracks</h2>}

            {!isTotalEmpty && (
                <div className={s.controlsPanel}>
                    <SearchElement
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={'Search tracks'}
                        isLoading={isFetching}
                    />
                    <SortSelect
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        options={COMMON_SORT_OPTIONS}
                        onSortChange={handleSortChange}
                    />
                </div>
            )}

            {/* 1. Состояние первичной загрузки (скелетоны шапки и 5 строк) */}
            {isLoading && pages.length === 0 && (
                <div style={{ marginTop: '32px' }}>
                    <TracksListHeaderSkeleton />
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TrackRowSkeleton key={index} />
                    ))}
                </div>
            )}


            {isTotalEmpty && <h2>Tracks not found</h2>}

            {/* Состояние пустого поиска */}
            {isSearchEmpty && (
                <div className={s.emptyState}>
                    <h3 className={s.emptyStateTitle}>No tracks found for "{searchQuery}"</h3>
                </div>
            )}

            {/* Отображение списка треков */}
            {!isLoading && pages.length > 0 && <TracksListRows tracks={pages} isLoading={isFetching} />}

            {/* Бесконечный скролл */}
            {hasNextPage && pages.length > 0 && (
                <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage} />
            )}

            {!hasNextPage && pages.length > 0 && (
                <p style={{ textAlign: 'center', color: 'var(--color-gray-600)', marginTop: '24px' }}>
                    Nothing more to load
                </p>
            )}
        </div>
    );
};
