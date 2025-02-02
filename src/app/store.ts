import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "../features/media-slice";
import folderReducer from "../features/folder-slice";

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    folders: folderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
