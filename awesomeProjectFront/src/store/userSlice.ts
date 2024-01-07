import { createSlice } from "@reduxjs/toolkit";

interface userState {
    login: string | null
    role: number
}

const initialState: userState = {
    login: null,
    role: 0,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLogin: (state, { payload }) => {
            state.login = payload
        },
        resetLogin: (state) => {
            state.login = null
        },
        setRole: (state, { payload }) => {
            state.role = payload
        },
        resetRole: (state) => {
            state.role = 0
        },
    },
});

export default userSlice.reducer;

export const { setLogin, resetLogin, setRole, resetRole } = userSlice.actions;
