import { createSlice } from "@reduxjs/toolkit";

interface searchState {
    data_type_name: string

    user: string
    status: string
    formationDateStart: string | null
    formationDateEnd: string | null
}

const initialState: searchState = {
    data_type_name: '',

    user: '',
    status: '',
    formationDateStart: null,
    formationDateEnd: null,
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setDataTypeName: (state, { payload }) => {
            state.data_type_name = payload
        },
        setUser: (state, { payload }) => {
            state.user = payload
        },
        setStatus: (state, { payload }) => {
            state.status = payload
        },
        setDateStart: (state, { payload }) => {
            state.formationDateStart = payload
        },
        setDateEnd: (state, { payload }) => {
            state.formationDateEnd = payload
        },
        reset: (state) => {
            state = initialState
            console.log(state)
        }
    },
});

export default searchSlice.reducer;

export const { reset, setDataTypeName, setUser, setStatus, setDateStart, setDateEnd } = searchSlice.actions;
