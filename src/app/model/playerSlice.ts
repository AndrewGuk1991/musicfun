import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {PlayerState, TrackItem} from "@/app/model/player.types.ts";

const initialState: PlayerState = {
    isPlaying: false,
    currentTrackId: null,
    trackUrl: null,
    trackData: null,
    isLooping: false,
    isShuffled: false,
    queue: [],
    originalQueue: [],
    currentTime: 0,
    duration: 0,
    seekTo: null,
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        playTrack: (state, action: PayloadAction<{ track: TrackItem; tracksList?: TrackItem[] }>) => {
            const { track, tracksList } = action.payload;
            state.currentTrackId = track.id;
            state.trackUrl = track.url;
            state.trackData = track.data;
            state.isPlaying = true;

            // ИСПРАВЛЕНО: Мгновенно сбрасываем прогресс в сторе при старте нового трека
            state.currentTime = 0;
            state.duration = 0;

            if (tracksList) {
                state.originalQueue = tracksList;
                if (state.isShuffled) {
                    const filtered = tracksList.filter(t => t.id !== track.id);
                    state.queue = [track, ...filtered.sort(() => Math.random() - 0.5)];
                } else {
                    state.queue = tracksList;
                }
            }
        },
        pauseTrack: (state) => {
            state.isPlaying = false;
        },
        togglePlay: (state) => {
            if (state.currentTrackId) {
                state.isPlaying = !state.isPlaying;
            }
        },
        toggleLoop: (state) => {
            state.isLooping = !state.isLooping;
        },
        toggleShuffle: (state) => {
            state.isShuffled = !state.isShuffled;

            if (state.isShuffled && state.queue.length > 0) {
                // Перемешиваем, оставляя текущий трек на месте (чтобы очередь не сбилась прямо сейчас)
                const current = state.queue.find(t => t.id === state.currentTrackId);
                const filtered = state.queue.filter(t => t.id !== state.currentTrackId);
                state.queue = current
                    ? [current, ...filtered.sort(() => Math.random() - 0.5)]
                    : state.queue.sort(() => Math.random() - 0.5);
            } else {
                // Возвращаем исходный порядок
                state.queue = state.originalQueue;
            }
        },
        nextTrack: (state) => {
            if (state.queue.length === 0) return;
            const currentIndex = state.queue.findIndex(t => t.id === state.currentTrackId);
            const nextIndex = (currentIndex + 1) % state.queue.length;
            const nextTrack = state.queue[nextIndex];

            state.currentTrackId = nextTrack.id;
            state.trackUrl = nextTrack.url;
            state.trackData = nextTrack.data;
            state.isPlaying = true;

            // ИСПРАВЛЕНО: Сбрасываем время при переходе вперед
            state.currentTime = 0;
            state.duration = 0;
        },
        prevTrack: (state) => {
            if (state.queue.length === 0) return;
            const currentIndex = state.queue.findIndex(t => t.id === state.currentTrackId);
            const prevIndex = (currentIndex - 1 + state.queue.length) % state.queue.length;
            const prevTrack = state.queue[prevIndex];

            state.currentTrackId = prevTrack.id;
            state.trackUrl = prevTrack.url;
            state.trackData = prevTrack.data;
            state.isPlaying = true;

            // ИСПРАВЛЕНО: Сбрасываем время при переходе назад
            state.currentTime = 0;
            state.duration = 0;
        },
        stopPlayer: (state) => {
            state.isPlaying = false;
            state.currentTrackId = null;
            state.trackUrl = null;
            state.trackData = null;
            state.queue = [];
            state.originalQueue = [];
        },
        updateProgress: (state, action: PayloadAction<{ currentTime: number; duration: number }>) => {
            state.currentTime = action.payload.currentTime;
            state.duration = action.payload.duration;
        },
        seekTrack: (state, action: PayloadAction<number>) => {
            state.seekTo = action.payload;
        },
        clearSeek: (state) => {
            state.seekTo = null;
        },
        updateQueue: (state, action: PayloadAction<TrackItem[]>) => {
            // Обновляем оригинальный список новыми дозагруженными треками
            state.originalQueue = action.payload;

            if (state.isShuffled) {
                // Если включен Shuffle, нам нужно подмешать ТОЛЬКО новые треки в конец,
                // чтобы не перемешивать заново те, что пользователь уже послушал.
                const newTracks = action.payload.filter(
                    (track) => !state.queue.some((q) => q.id === track.id)
                );
                if (newTracks.length > 0) {
                    state.queue = [...state.queue, ...newTracks.sort(() => Math.random() - 0.5)];
                }
            } else {
                // В обычном режиме просто заменяем очередь на актуальный расширенный список
                state.queue = action.payload;
            }
        },
    },
});

export const {
    playTrack,
    pauseTrack,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    nextTrack,
    prevTrack,
    stopPlayer,
    updateProgress,
    seekTrack,
    clearSeek,
    updateQueue
} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;
