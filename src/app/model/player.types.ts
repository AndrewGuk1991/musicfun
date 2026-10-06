
export type PlayerTrackInfo = {
    title: string;
    artistName: string;
    coverUrl: string;
};

// Структура трека, которую вы получаете из API
export type TrackItem = {
    id: string;
    url: string;
    data: PlayerTrackInfo;
};

export type PlayerState = {
    isPlaying: boolean;
    currentTrackId: string | null;
    trackUrl: string | null;
    trackData: PlayerTrackInfo | null;
    isLooping: boolean;
    isShuffled: boolean;
    queue: TrackItem[];         // Текущая рабочая очередь (может быть перемешана)
    originalQueue: TrackItem[]; // Оригинальный порядок треков
    currentTime: number;
    duration: number;
    seekTo: number | null;
};