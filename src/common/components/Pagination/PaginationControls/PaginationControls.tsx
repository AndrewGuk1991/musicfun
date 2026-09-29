import { getPaginationPages } from "@/common/utils";
import s from './PaginationControls.module.css';
import {Icon} from "@/common/components";

type Props = {
    currentPage: number;
    pagesCount: number;
    setCurrentPage: (currentPage: number) => void;
    isLoading?: boolean; // Флаг для блокировки кнопок во время загрузки данных
};

export const PaginationControls = ({ pagesCount, currentPage, setCurrentPage, isLoading }: Props) => {
    const pages = getPaginationPages(currentPage, pagesCount);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pagesCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Если страниц нет или всего одна, пагинацию скрываем
    if (pagesCount <= 1) return null;

    return (
        <div className={s.pagination}>
            {/* Стрелочка Влево */}
            <button
                className={`${s.pageButton} ${s.arrowButton}`}
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isLoading}
                type="button"
                aria-label="Previous page"
            >
                <Icon
                    id={'icon-arrow-left'}
                    height={12}
                    width={8}
                    viewBox="0 0 8 12"
                />
            </button>

            {/* Вывод номеров страниц и многоточий */}
            {pages.map((page, idx) =>
                page === '...' ? (
                    <span className={s.ellipsis} key={`ellipsis-${idx}`}>
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        className={
                            page === currentPage
                                ? `${s.pageButton} ${s.pageButtonActive}`
                                : s.pageButton
                        }
                        onClick={() => setCurrentPage(Number(page))}
                        disabled={page === currentPage || isLoading}
                        type="button"
                    >
                        {page}
                    </button>
                )
            )}

            {/* Стрелочка Вправо */}
            <button
                className={`${s.pageButton} ${s.arrowButton}`}
                onClick={handleNextPage}
                disabled={currentPage === pagesCount || isLoading}
                type="button"
                aria-label="Next page"
            >
                <Icon
                    id={'icon-arrow-right'}
                    height={12}
                    width={8}
                    viewBox="0 0 8 12"
                />
            </button>
        </div>
    );
};
