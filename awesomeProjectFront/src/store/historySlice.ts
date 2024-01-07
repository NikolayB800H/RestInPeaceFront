import { createSlice } from "@reduxjs/toolkit";

export interface page {
    path: string
    name: string
}

interface historyState {
    pages: page[]
}

const initialState: historyState = {
    pages: []
}

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        addToHistory: (state, { payload }) => {
            state.pages = [...state.pages, payload]
        },
        cutHistory: (state, { payload }) => {
            state.pages = state.pages.slice(0, payload)
        },
        clearHistory: (state) => {
            state.pages = []
        },
    },
});

export default historySlice.reducer;

export const { addToHistory, clearHistory, cutHistory } = historySlice.actions;
