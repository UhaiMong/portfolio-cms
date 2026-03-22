import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Media, Pagination } from "../../types";

interface MediaState {
  media: Media[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}
const initialState: MediaState = {
  media: [],
  pagination: null,
  loading: false,
  error: null,
};

export const fetchMedia = createAsyncThunk(
  "media/fetchAll",
  async (params: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const r = await api.get("/media", { params });
      return r.data.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch media",
      );
    }
  },
);
export const uploadMedia = createAsyncThunk(
  "media/upload",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const r = await api.post("/media/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return r.data.data as Media;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to upload media",
      );
    }
  },
);
export const deleteMedia = createAsyncThunk(
  "media/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/media/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to delete media",
      );
    }
  },
);

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchMedia.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchMedia.fulfilled, (s, a) => {
      s.loading = false;
      s.media = a.payload.media;
      s.pagination = a.payload.pagination;
    });
    b.addCase(fetchMedia.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });
    b.addCase(uploadMedia.fulfilled, (s, a) => {
      s.media.unshift(a.payload);
    });
    b.addCase(deleteMedia.fulfilled, (s, a) => {
      s.media = s.media.filter((m) => m._id !== a.payload);
    });
  },
});

export const { clearError } = mediaSlice.actions;
export default mediaSlice.reducer;
