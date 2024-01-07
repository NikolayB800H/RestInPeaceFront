import { createSlice } from "@reduxjs/toolkit";

interface searchState {
    data_type_name: string

    status: string
    formationDateStart: string | null
    formationDateEnd: string | null
}

const initialState: searchState = {
    data_type_name: '',

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
        setStatus: (state, { payload }) => {
            state.status = payload
        },
        setDateStart: (state, { payload }) => {
            state.formationDateStart = payload
        },
        setDateEnd: (state, { payload }) => {
            state.formationDateEnd = payload
        },
    },
});

export default searchSlice.reducer;

export const { setDataTypeName, setStatus, setDateStart, setDateEnd } = searchSlice.actions;
