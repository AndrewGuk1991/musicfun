import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Заменили interface на type
type PlayerState = {
    isPlaying: boolean;
    currentTrackId: string | null;
};

const initialState: PlayerState = {
    isPlaying: false,
    currentTrackId: null,
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        playTrack: (state, action: PayloadAction<string>) => {
            state.currentTrackId = action.payload;
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
        },
    },
});

export const { playTrack, pauseTrack, togglePlay, stopPlayer } = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
