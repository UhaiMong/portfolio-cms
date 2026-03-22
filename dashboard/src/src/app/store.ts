import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import blogReducer from "../features/blog/blogSlice";
import bioReducer from "../features/bio/bioSlice";
import bannerReducer from "../features/banner/bannerSlice";
import resumeReducer from "../features/resume/resumeSlice";
import contactReducer from "../features/contact/contactSlice";
import mediaReducer from "../features/media/mediaSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    blog: blogReducer,
    bio: bioReducer,
    banner: bannerReducer,
    resume: resumeReducer,
    contact: contactReducer,
    media: mediaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
