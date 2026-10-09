import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import api from "../api";

const savedToken = localStorage.getItem("access_token");
const savedUser = localStorage.getItem("user");

export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async (_, thunkAPI) => {
        try {
            const { data } = await api.get("/users/info");

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Authentication failed"
                }
            );
        }
    }
);

const initialState = {
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedToken,
    initialized: false
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            const { token, user } = action.payload;

            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            state.initialized = true;

            localStorage.setItem(
                "access_token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
        },

        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.initialized = true;

            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
        },

        authInitialized: (state) => {
            state.initialized = true;
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.initialized = true;

                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload)
                );
            })

            .addCase(checkAuth.rejected, (state) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.initialized = true;

                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
            });
    }
});

export const {
    loginSuccess,
    logout,
    authInitialized
} = authSlice.actions;

export default authSlice.reducer;