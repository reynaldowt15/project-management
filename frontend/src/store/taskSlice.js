import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import api from "../api";

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (projectId) => {
        const { data } = await api.get(
            `/projects/${projectId}/tasks`
        );

        return data;
    }
);

export const createTask = createAsyncThunk(
    "tasks/createTask",
    async ({ projectId, task }) => {
        const { data } = await api.post(
            `/projects/${projectId}/tasks`,
            task
        );

        return data;
    }
);

export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async ({ id, data }) => {
        const response = await api.patch(
            `/tasks/${id}`,
            data
        );

        return response.data;
    }
);

export const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (id) => {
        await api.delete(`/tasks/${id}`);

        return id;
    }
);

export const generateTasks = createAsyncThunk(
    "tasks/generateTasks",
    async (projectId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                `/projects/${projectId}/generate-tasks`
            );

            return data.tasks;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to generate tasks"
            );
        }
    }
);

const initialState = {
    tasks: [],
    generatedTasks: [],
    loading: false,
    loadingAi: false,
    error: null
};

const taskSlice = createSlice({
    name: "tasks",

    initialState,

    reducers: {
        clearTasks: (state) => {
            state.tasks = [];
        },

        setGeneratedTasks: (state, action) => {
            state.generatedTasks = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })

            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.unshift(action.payload);
            })

            .addCase(updateTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.map(
                    (task) =>
                        task.id === action.payload.id
                            ? action.payload
                            : task
                );
            })

            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(
                    (task) =>
                        task.id !== action.payload
                );
            })

            .addCase(generateTasks.pending, (state) => {
                state.loadingAi = true;
                state.error = null;
            })

            .addCase(generateTasks.fulfilled, (state, action) => {
                state.loadingAi = false;
                state.generatedTasks = action.payload;
            })

            .addCase(generateTasks.rejected, (state, action) => {
                state.loadingAi = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearTasks,
    setGeneratedTasks
} = taskSlice.actions;

export default taskSlice.reducer;