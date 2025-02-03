import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MediaItem {
  id: string;
  type: "image" | "video" | "gif";
  name: string;
  url: string;
  width: number;
  height: number;
}

interface MediaState {
  media: MediaItem[];
}

const initialState: MediaState = {
  media: [],
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMedia: (state, action: PayloadAction<MediaItem[]>) => {
      state.media = action.payload;
    },
    deleteMedia: (state, action: PayloadAction<string>) => {
      state.media = state.media.filter((item) => item.id !== action.payload);
    },
    renameMedia: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const media = state.media.find((item) => item.id === action.payload.id);
      if (media) {
        media.name = action.payload.newName;
      }
    },
  },
});

export const { setMedia, deleteMedia, renameMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
