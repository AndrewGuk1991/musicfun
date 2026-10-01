import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type PlayerState = {
    isPlaying: boolean;
    currentTrackId: string | null;
    trackUrl: string | null;
};

const initialState: PlayerState = {
    isPlaying: false,
    currentTrackId: null,
    trackUrl: null,
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        playTrack: (state, action: PayloadAction<{ id: string; url: string }>) => {
            state.currentTrackId = action.payload.id;
            state.trackUrl = action.payload.url;
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
        stopPlayer: (state) => {
            state.isPlaying = false;
            state.currentTrackId = null;
            state.trackUrl = null;
        },
    },
});

export const { playTrack, pauseTrack, togglePlay, stopPlayer } = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
