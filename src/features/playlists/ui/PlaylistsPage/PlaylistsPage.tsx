import s from './PlaylistsPage.module.css'
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlists/playlistsApi.ts";
import {PlaylistsList} from "@/features/playlists/ui";
import {type ChangeEvent, useState} from "react";
import {useDebounceValue} from "@/common/hooks";
import {Pagination} from "@/common/components/Pagination/Pagination.tsx";
import {PlaylistsSearch} from "@/features/playlists/ui/PlaylistsPage/PlaylistsSearch/PlaylistsSearch.tsx";
import {PlaylistsSort} from "@/features/playlists/ui/PlaylistsPage/PlaylistsSort/PlaylistsSort.tsx";

export const PlaylistsPage = () => {
    const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
    const [search, setSearch] = useState('')

    const toggleSort = () => {
        setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
        setCurrentPage(1);
    };

    const debounceSearch = useDebounceValue(search)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const {data, isLoading} = useFetchPlaylistsQuery({
        search: debounceSearch,
        pageNumber: currentPage,
        pageSize,
        sortBy: 'addedAt',
        sortDirection,

    })

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
                        <PlaylistsSearch
                            value={search}
                            onChange={searchPlaylistHandler}
                            isLoading={isLoading}
                        />
                        <PlaylistsSort
                            sortDirection={sortDirection}
                            onToggleSort={toggleSort}
                            isLoading={isLoading}
                        />
                    </div>
                </>
            )}

            <PlaylistsList
                playlists={data?.data || []}
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
