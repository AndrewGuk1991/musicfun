import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type PlayerTrackInfo = {
    title: string;
    artistName: string;
    coverUrl: string;
};

type PlayerState = {
    isPlaying: boolean;
    currentTrackId: string | null;
    trackUrl: string | null;
    trackData: PlayerTrackInfo | null;
    isLooping: boolean;     // Режим повтора трека
    isShuffled: boolean;    // Режим перемешивания
};

const initialState: PlayerState = {
    isPlaying: false,
    currentTrackId: null,
    trackUrl: null,
    trackData: null,
    isLooping: false,
    isShuffled: false,
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        playTrack: (state, action: PayloadAction<{ id: string; url: string; data: PlayerTrackInfo }>) => {
            state.currentTrackId = action.payload.id;
            state.trackUrl = action.payload.url;
            state.trackData = action.payload.data;
            state.isPlaying = true;
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
        },
        stopPlayer: (state) => {
            state.isPlaying = false;
            state.currentTrackId = null;
            state.trackUrl = null;
            state.trackData = null;
        },
    },
});

export const { playTrack, pauseTrack, togglePlay, toggleLoop, toggleShuffle, stopPlayer } = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
