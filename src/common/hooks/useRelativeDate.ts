
import { useMemo } from 'react';

export const useRelativeDate = (dateString: string): string => {
    return useMemo(() => {
        if (!dateString) return '';

        const createdDate = new Date(dateString);
        const today = new Date();

        // Сбрасываем время, чтобы сравнивать только дни
        createdDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = createdDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "today";
        }

        // "en" можно заменить на "ru", если потребуется локализация
        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
        return rtf.format(diffDays, "day");
    }, [dateString]); // Пересчитываем только при изменении строки даты
};

