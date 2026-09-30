import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import { baseApi } from "../api/baseApi"
import {playerReducer} from "@/features/tracks/model/playerSlice.ts";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        player: playerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})


setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>