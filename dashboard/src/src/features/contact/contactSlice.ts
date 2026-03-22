import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Contact, Pagination } from "../../types";

interface ContactState {
  contacts: Contact[];
  unreadCount: number;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}
const initialState: ContactState = {
  contacts: [],
  unreadCount: 0,
  pagination: null,
  loading: false,
  error: null,
};

export const fetchContacts = createAsyncThunk(
  "contact/fetchAll",
  async (params: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const r = await api.get("/contact", { params });
      return r.data.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch contacts",
      );
    }
  },
);
export const updateStatus = createAsyncThunk(
  "contact/updateStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const r = await api.patch(`/contact/${id}/status`, { status });
      return r.data.data as Contact;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to update status",
      );
    }
  },
);
export const deleteContact = createAsyncThunk(
  "contact/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/contact/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to delete message",
      );
    }
  },
);
export const bulkDelete = createAsyncThunk(
  "contact/bulkDelete",
  async (ids: string[], { rejectWithValue }) => {
    try {
      await api.delete("/contact/bulk", { data: { ids } });
      return ids;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to delete messages",
      );
    }
  },
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchContacts.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchContacts.fulfilled, (s, a) => {
      s.loading = false;
      s.contacts = a.payload.contacts;
      s.unreadCount = a.payload.unreadCount;
      s.pagination = a.payload.pagination;
    });
    b.addCase(fetchContacts.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });
    b.addCase(updateStatus.fulfilled, (s, a) => {
      const i = s.contacts.findIndex((c) => c._id === a.payload._id);
      if (i !== -1) s.contacts[i] = a.payload;
    });
    b.addCase(deleteContact.fulfilled, (s, a) => {
      s.contacts = s.contacts.filter((c) => c._id !== a.payload);
    });
    b.addCase(bulkDelete.fulfilled, (s, a) => {
      s.contacts = s.contacts.filter((c) => !a.payload.includes(c._id));
    });
  },
});

export const { clearError } = contactSlice.actions;
export default contactSlice.reducer;
