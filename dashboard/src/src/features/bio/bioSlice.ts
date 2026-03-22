import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Bio } from "../../types";

interface BioState {
  bio: Bio | null;
  loading: boolean;
  error: string | null;
}
const initialState: BioState = { bio: null, loading: false, error: null };

export const fetchBio = createAsyncThunk(
  "bio/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const r = await api.get("/bio");
      return r.data.data as Bio;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch bio",
      );
    }
  },
);

export const createBio = createAsyncThunk(
  "bio/create",
  async (data: Partial<Bio> | FormData, { rejectWithValue }) => {
    try {
      const r = await api.post("/bio", data);
      return r.data.data as Bio;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to create bio",
      );
    }
  },
);

export const updateBio = createAsyncThunk(
  "bio/update",
  async (
    { id, data }: { id: string; data: Partial<Bio> | FormData },
    { rejectWithValue },
  ) => {
    try {
      const r = await api.patch(`/bio/${id}`, data);
      return r.data.data as Bio;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to update bio",
      );
    }
  },
);

const bioSlice = createSlice({
  name: "bio",
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchBio.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchBio.fulfilled, (s, a) => {
      s.loading = false;
      s.bio = a.payload;
    });
    b.addCase(fetchBio.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });
    b.addCase(createBio.fulfilled, (s, a) => {
      s.bio = a.payload;
    });
    b.addCase(updateBio.fulfilled, (s, a) => {
      s.bio = a.payload;
    });
  },
});

export const { clearError } = bioSlice.actions;
export default bioSlice.reducer;
