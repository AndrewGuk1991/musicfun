
export const formatEUPDate = (isoString: string | null | undefined): string => {
    if (!isoString) return '';

    try {
        const date = new Date(isoString);

        // Защита от невалидной строки даты
        if (isNaN(date.getTime())) {
            return '';
        }

        // Использование локали 'en-GB' гарантирует порядок ДД/ММ/ГГГГ со слэшами
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    } catch (error) {
        console.error('Ошибка при форматировании даты:', error);
        return '';
    }
};
