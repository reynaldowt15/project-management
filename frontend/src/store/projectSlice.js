import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import api from "../api";

export const fetchProjects = createAsyncThunk(
    "projects/fetchProjects",
    async () => {
        const { data } = await api.get("/projects");

        return data;
    }
);

export const fetchProjectById = createAsyncThunk(
    "projects/fetchProjectById",
    async (id) => {
        const { data } = await api.get(
            `/projects/${id}`
        );

        return data;
    }
);

export const createProject = createAsyncThunk(
    "projects/createProject",
    async (project) => {
        const { data } = await api.post(
            "/projects",
            project
        );

        return data;
    }
);

export const updateProject = createAsyncThunk(
    "projects/updateProject",
    async ({ id, data }) => {
        const response = await api.patch(
            `/projects/${id}`,
            data
        );

        return response.data;
    }
);

export const deleteProject = createAsyncThunk(
    "projects/deleteProject",
    async (id) => {
        await api.delete(`/projects/${id}`);

        return id;
    }
);

const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null
};

const projectSlice = createSlice({
    name: "projects",

    initialState,

    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        }
    },

    extraReducers: (builder) => {
        builder

            // GET projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })

            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // GET one project
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
            })

            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // CREATE
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
            })

            // UPDATE
            .addCase(updateProject.fulfilled, (state, action) => {
                const updatedProject = action.payload;

                state.projects = state.projects.map(
                    (project) =>
                        project.id === updatedProject.id
                            ? updatedProject
                            : project
                );

                if (
                    state.currentProject?.id ===
                    updatedProject.id
                ) {
                    state.currentProject = updatedProject;
                }
            })

            // DELETE
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(
                    (project) =>
                        project.id !== action.payload
                );

                if (
                    state.currentProject?.id ===
                    action.payload
                ) {
                    state.currentProject = null;
                }
            });
    }
});

export const {
    clearCurrentProject
} = projectSlice.actions;

export default projectSlice.reducer;