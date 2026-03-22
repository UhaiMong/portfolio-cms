import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Banner } from "../../types";

interface BannerState {
  banners: Banner[];
  active: Banner | null;
  loading: boolean;
  error: string | null;
}
const initialState: BannerState = {
  banners: [],
  active: null,
  loading: false,
  error: null,
};

export const fetchBanners = createAsyncThunk(
  "banner/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const r = await api.get("/banner/all");
      return r.data.data as Banner[];
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch banners",
      );
    }
  },
);
export const createBanner = createAsyncThunk(
  "banner/create",
  async (data: Partial<Banner> | FormData, { rejectWithValue }) => {
    try {
      const r = await api.post("/banner", data);
      return r.data.data as Banner;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to create banner",
      );
    }
  },
);
export const updateBanner = createAsyncThunk(
  "banner/update",
  async (
    { id, data }: { id: string; data: Partial<Banner> | FormData },
    { rejectWithValue },
  ) => {
    try {
      const r = await api.patch(`/banner/${id}`, data);
      return r.data.data as Banner;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to update banner",
      );
    }
  },
);
export const deleteBanner = createAsyncThunk(
  "banner/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/banner/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to delete banner",
      );
    }
  },
);
export const activateBanner = createAsyncThunk(
  "banner/activate",
  async (id: string, { rejectWithValue }) => {
    try {
      const r = await api.patch(`/banner/${id}/activate`);
      return r.data.data as Banner;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to activate banner",
      );
    }
  },
);

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchBanners.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchBanners.fulfilled, (s, a) => {
      s.loading = false;
      s.banners = a.payload;
      s.active = a.payload.find((x) => x.isActive) || null;
    });
    b.addCase(fetchBanners.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });
    b.addCase(createBanner.fulfilled, (s, a) => {
      s.banners.unshift(a.payload);
    });
    b.addCase(updateBanner.fulfilled, (s, a) => {
      const i = s.banners.findIndex((x) => x._id === a.payload._id);
      if (i !== -1) s.banners[i] = a.payload;
    });
    b.addCase(deleteBanner.fulfilled, (s, a) => {
      s.banners = s.banners.filter((x) => x._id !== a.payload);
    });
    b.addCase(activateBanner.fulfilled, (s, a) => {
      s.banners = s.banners.map((x) => ({
        ...x,
        isActive: x._id === a.payload._id,
      }));
      s.active = a.payload;
    });
  },
});

export const { clearError } = bannerSlice.actions;
export default bannerSlice.reducer;
