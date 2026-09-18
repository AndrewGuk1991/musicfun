
import { errorToast } from "@/common/utils";

export const validateCover = (fileList: FileList | null | undefined): boolean | string => {
    if (!fileList || fileList.length === 0) return true;

    const file = fileList[0];
    if (!file) {
        errorToast('Failed to read the selected file. Please try again.');
        return 'File read error';
    }

    const maxSize = 1024 * 1024; // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
        errorToast('Only JPEG, PNG or GIF images are allowed');
        return 'Invalid type';
    }

    if (file.size > maxSize) {
        errorToast(`The file is too large (max. ${Math.round(maxSize / 1024)} KB)`);
        return 'File too large';
    }

    return true;
};

