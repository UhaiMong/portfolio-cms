import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Project, Pagination } from "../../types";

interface ProjectState {
  projects: Project[];
  selected: Project | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selected: null,
  pagination: null,
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (params: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/projects", { params });
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/projects", data);
      return res.data.data as Project;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async (
    { id, data }: { id: string; data: Partial<Project> | FormData },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.patch(`/projects/${id}`, data);
      return res.data.data as Project;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

export const toggleFeatured = createAsyncThunk(
  "projects/toggleFeatured",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/projects/${id}/featured`);
      return res.data.data as Project;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message);
    }
  },
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSelected: (s, a) => {
      s.selected = a.payload;
    },
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchProjects.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchProjects.fulfilled, (s, a) => {
      s.loading = false;
      s.projects = a.payload.projects;
      s.pagination = a.payload.pagination;
    });
    b.addCase(fetchProjects.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });

    b.addCase(createProject.fulfilled, (s, a) => {
      s.projects.unshift(a.payload);
    });
    b.addCase(updateProject.fulfilled, (s, a) => {
      const idx = s.projects.findIndex((p) => p._id === a.payload._id);
      if (idx !== -1) s.projects[idx] = a.payload;
    });
    b.addCase(deleteProject.fulfilled, (s, a) => {
      s.projects = s.projects.filter((p) => p._id !== a.payload);
    });
    b.addCase(toggleFeatured.fulfilled, (s, a) => {
      const idx = s.projects.findIndex((p) => p._id === a.payload._id);
      if (idx !== -1) s.projects[idx] = a.payload;
    });
  },
});

export const { setSelected, clearError } = projectSlice.actions;
export default projectSlice.reducer;
