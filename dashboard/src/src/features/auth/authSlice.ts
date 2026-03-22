import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { AuthState, Admin } from "../../types";

//  Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post("/auth/login", credentials);
      const { token, admin } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("admin", JSON.stringify(admin));
      return { token, admin };
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      return rejectWithValue(msg);
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      return res.data.data as Admin;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: Partial<Admin>, { rejectWithValue }) => {
    try {
      const res = await api.patch("/auth/update-me", data);
      return res.data.data as Admin;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

// ── Initial state ─────────────────────────────────────────────
const getSavedAdmin = (): Admin | null => {
  try {
    const raw = localStorage.getItem("admin");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  admin: getSavedAdmin(),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.isAuthenticated = true;
        s.token = a.payload.token;
        s.admin = a.payload.admin;
        s.error = null;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.isAuthenticated = false;
        s.error = a.payload as string;
      })
      // getMe
      .addCase(getMe.fulfilled, (s, a) => {
        s.admin = a.payload;
      })
      // updateProfile
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.admin = a.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
