import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Resume } from "../../types";

interface ResumeState {
  resumes: Resume[];
  active: Resume | null;
  loading: boolean;
  error: string | null;
}
const initialState: ResumeState = {
  resumes: [],
  active: null,
  loading: false,
  error: null,
};

export const fetchResumes = createAsyncThunk(
  "resume/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const r = await api.get("/resume/all");
      return r.data.data as Resume[];
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch resumes",
      );
    }
  },
);
export const uploadResume = createAsyncThunk(
  "resume/upload",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const r = await api.post("/resume/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return r.data.data as Resume;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to upload resume",
      );
    }
  },
);
export const activateResume = createAsyncThunk(
  "resume/activate",
  async (id: string, { rejectWithValue }) => {
    try {
      const r = await api.patch(`/resume/${id}/activate`);
      return r.data.data as Resume;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to activate resume",
      );
    }
  },
);
export const deleteResume = createAsyncThunk(
  "resume/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/resume/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to delete resume",
      );
    }
  },
);

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchResumes.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchResumes.fulfilled, (s, a) => {
      s.loading = false;
      s.resumes = a.payload;
      s.active = a.payload.find((r: Resume) => r.isActive) || null;
    });
    b.addCase(fetchResumes.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });
    b.addCase(uploadResume.fulfilled, (s, a) => {
      s.resumes.unshift(a.payload);
    });
    b.addCase(activateResume.fulfilled, (s, a) => {
      s.resumes = s.resumes.map((r) => ({
        ...r,
        isActive: r._id === a.payload._id,
      }));
      s.active = a.payload;
    });
    b.addCase(deleteResume.fulfilled, (s, a) => {
      s.resumes = s.resumes.filter((r) => r._id !== a.payload);
    });
  },
});

export const { clearError } = resumeSlice.actions;
export default resumeSlice.reducer;
