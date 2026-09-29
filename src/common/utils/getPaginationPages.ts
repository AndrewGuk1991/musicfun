const SIBLING_COUNT = 1; // 1 кнопка слева, 1 кнопка справа (итого диапазон из 3 страниц в центре)

/**
 * Генерирует массив страниц: [1] [2] [3] [4] ... [10]
 */
export const getPaginationPages = (currentPage: number, pagesCount: number): (number | '...')[] => {
    if (pagesCount <= 1) return [];

    const pages: (number | '...')[] = [];

    // Определяем базовые границы вокруг текущей страницы
    let leftSibling = Math.max(2, currentPage - SIBLING_COUNT);
    let rightSibling = Math.min(pagesCount - 1, currentPage + SIBLING_COUNT);

    // Дополнительный сдвиг у левого края, чтобы при первой странице показывались 2, 3, 4
    if (currentPage <= 2) {
        rightSibling = Math.min(pagesCount - 1, 4);
    }

    // Дополнительный сдвиг у правого края, чтобы в конце показывались предкрайние страницы
    if (currentPage >= pagesCount - 1) {
        leftSibling = Math.max(2, pagesCount - 3);
    }

    // 1. Всегда показываем первую страницу
    pages.push(1);

    // 2. Многоточие слева
    if (leftSibling > 2) {
        pages.push('...');
    }

    // 3. Центральный диапазон страниц
    for (let page = leftSibling; page <= rightSibling; page++) {
        pages.push(page);
    }

    // 4. Многоточие справа
    if (rightSibling < pagesCount - 1) {
        pages.push('...');
    }

    // 5. Всегда показываем последнюю страницу
    if (pagesCount > 1) {
        pages.push(pagesCount);
    }

    return pages;
};
