import s from './PlaylistsPage.module.css'
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {PlaylistsList} from "@/features/playlists/ui";
import {type ChangeEvent, useState} from "react";
import {useDebounceValue} from "@/common/hooks";
import {Pagination} from "@/common/components/Pagination/Pagination.tsx";
import {SearchElement, SortSelect} from "@/common/components";
import {COMMON_SORT_OPTIONS} from "@/common/components/SortSelect/config/sortOptions.ts";
import type {AppSortField, SortDirection} from "@/common/types/sort.ts";


export const PlaylistsPage = () => {
    const [search, setSearch] = useState('')
    const debounceSearch = useDebounceValue(search)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [sortBy, setSortBy] = useState<AppSortField>("addedAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const {data, isLoading} = useFetchPlaylistsQuery({
        search: debounceSearch,
        pageNumber: currentPage,
        pageSize,
        sortBy,
        sortDirection,
    })

    const playlists = data?.data || [];

    // Обработчик изменения типа или направления сортировки
    const handleSortChange = (newSortBy: AppSortField, newDirection: SortDirection) => {
        setSortBy(newSortBy);
        setSortDirection(newDirection);
        setCurrentPage(1); // Принудительно сбрасываем пагинацию на первую страницу
    };


    const changePageSizeHandler = (size: number) => {
        setPageSize(size)
        setCurrentPage(1)
    }

    const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
        setCurrentPage(1)
    }

    const hasData = isLoading || (data?.data && data.data.length > 0);

    return (
        <div className={s.container}>
            {hasData && (
                <>
                    <h1 className={s.title}>All Playlists</h1>

                    <div className={s.searchWrapper}>
                        <SearchElement
                            value={search}
                            onChange={searchPlaylistHandler}
                            isLoading={isLoading}
                            placeholder={'Search playlist'}
                        />
                        <SortSelect
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            options={COMMON_SORT_OPTIONS}
                            onSortChange={handleSortChange}
                        />
                    </div>
                </>
            )}

            <PlaylistsList
                playlists={playlists}
                isLoading={isLoading}
                countSkeleton={pageSize}
            />

            {hasData && (
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pagesCount={data?.meta.pagesCount || 1}
                    pageSize={pageSize}
                    changePageSize={changePageSizeHandler}
                />
            )}
        </div>
    )
}
