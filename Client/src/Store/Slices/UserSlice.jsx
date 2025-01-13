import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: [],
    loading: false,
    error: null,
    success: false,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getAllUsersAction: (state, action) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        getAllUsersSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload || [];
            state.success = true;
        },
        getAllUsersError: (state, action) => {
            state.loading = false;
            state.error = action.payload || [];
            state.success = false;
        },
        getAllUsersReset: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
});

export const { getAllUsersAction, getAllUsersSuccess, getAllUsersError, getAllUsersReset } = usersSlice.actions;
export default usersSlice.reducer;
