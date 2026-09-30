import {useFetchTracksInfiniteQuery} from "@/features/tracks/api/tracksApi.ts";
import s from './TracksPage.module.css'

import {useDebounceValue, useInfiniteScroll} from "@/common/hooks";
import {TracksList} from "@/features/tracks/ui/TracksList/TracksList.tsx";
import {LoadingTrigger} from "@/features/tracks/ui/LoadingTrigger/LoadingTrigger.tsx";
import {SearchElement} from "@/common/components";
import {useState} from "react";

export const TracksPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounceValue(searchQuery);

    const {data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage} = useFetchTracksInfiniteQuery({ search: debouncedSearch })

    const {observerRef} = useInfiniteScroll({fetchNextPage, hasNextPage, isFetching})

    const pages = data?.pages.flatMap((page) => page.data) || []

    return (
        <div className={s.container}>
            <h2 className={s.title}>All Tracks</h2>
            <SearchElement value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder={'Search tracks'}
                           isLoading={isFetching} />
            <TracksList tracks={pages}/>
            {hasNextPage && <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage}/>}
            {!hasNextPage && pages.length > 0 && <p>Nothing more load</p>}
        </div>
    )
}