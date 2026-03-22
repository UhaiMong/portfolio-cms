import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Blog, Pagination } from "../../types";

interface BlogState {
  blogs: Blog[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  selectedBlog: Blog | null;
}

const initialState: BlogState = {
  blogs: [],
  pagination: null,
  loading: false,
  error: null,
  selectedBlog: null,
};

export const fetchBlogs = createAsyncThunk(
  "blog/fetchAll",
  async (params: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const r = await api.get("/blog", { params });
      return r.data.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch blogs",
      );
    }
  },
);

export const fetchBlogById = createAsyncThunk(
  "blog/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const r = await api.get(`/blog/blog-details/${id}`);
      return r.data.data as Blog;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch blog details",
      );
    }
  },
);

export const createBlog = createAsyncThunk(
  "blog/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const r = await api.post("/blog", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return r.data.data as Blog;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to create blog",
      );
    }
  },
);

export const updateBlog = createAsyncThunk(
  "blog/update",
  async (
    { id, data }: { id: string; data: Partial<Blog> | FormData },
    { rejectWithValue },
  ) => {
    try {
      const r = await api.patch(`/blog/${id}`, data);
      return r.data.data as Blog;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to update blog",
      );
    }
  },
);

export const deleteBlog = createAsyncThunk(
  "blog/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/blog/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to delete blog",
      );
    }
  },
);

export const togglePublish = createAsyncThunk(
  "blog/togglePublish",
  async (id: string, { rejectWithValue }) => {
    try {
      const r = await api.patch(`/blog/${id}/publish`);
      return r.data.data as Blog;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to toggle publish",
      );
    }
  },
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    // Fetch blogs
    b.addCase(fetchBlogs.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    // Fetch Blog by id
    b.addCase(fetchBlogById.pending, (s) => {
      s.loading = true;
      s.error = null;
      s.selectedBlog = null;
    });
    b.addCase(fetchBlogById.fulfilled, (s, a) => {
      s.loading = false;
      s.selectedBlog = a.payload;
    });
    b.addCase(fetchBlogById.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });

    b.addCase(fetchBlogs.fulfilled, (s, a) => {
      s.loading = false;
      s.blogs = a.payload.blogs;
      s.pagination = a.payload.pagination;
    });
    b.addCase(fetchBlogs.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });
    // Create Blog
    b.addCase(createBlog.fulfilled, (s, a) => {
      s.blogs.unshift(a.payload);
    });
    // Update blog
    b.addCase(updateBlog.fulfilled, (s, a) => {
      const i = s.blogs.findIndex((x) => x._id === a.payload._id);
      if (i !== -1) s.blogs[i] = a.payload;
    });
    // Delete Blog
    b.addCase(deleteBlog.fulfilled, (s, a) => {
      s.blogs = s.blogs.filter((x) => x._id !== a.payload);
    });
    // Toggle publish
    b.addCase(togglePublish.fulfilled, (s, a) => {
      const i = s.blogs.findIndex((x) => x._id === a.payload._id);
      if (i !== -1) s.blogs[i] = a.payload;
    });
  },
});

export const { clearError } = blogSlice.actions;
export default blogSlice.reducer;
