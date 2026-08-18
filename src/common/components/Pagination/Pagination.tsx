
import s from './Pagination.module.css'
import {getPaginationPages} from "@/common/utils";

type Props = {
    currentPage: number
    setCurrentPage: (page: number) => void
    pagesCount: number
    pageSize: number
    changePageSize: (size: number) => void
}

export const Pagination = ({pagesCount, setCurrentPage, currentPage, changePageSize, pageSize}: Props) => {
    if (pagesCount <= 1) return null

    const pages = getPaginationPages(currentPage, pagesCount)

    return (
        <div className={s.container}>
            <div className={s.pagination}>
                {
                    pages.map((page, idx) =>
                        page === '...' ? (
                            <span className={s.ellipsis} key={`ellipsis-${idx}`}>
                            ...
                        </span>
                        ) : (
                            <button
                                key={page}
                                className={
                                    page === currentPage ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton
                                }
                                onClick={() => page !== currentPage && setCurrentPage(Number(page))}
                                disabled={page === currentPage}
                                type={'button'}
                            >
                                {page}
                            </button>
                        )

                    )
                }
            </div>
            <label>
                Show
                <select value={pageSize} onChange={e => changePageSize(Number(e.target.value))}>
                    {[2, 4, 6, 8, 16, 32].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                per page
            </label>
        </div>

    )
}
