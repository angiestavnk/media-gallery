import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteMedia } from "./media-slice";

export type MediaType = "image" | "video" | "gif";

export interface DragItem {
  mediaIds: string[];
}

export interface Folder {
  id: string;
  name: string;
  mediaIds: string[];
  children: Folder[];
  counts: Record<MediaType, number>;
}

interface FolderState {
  folders: Folder[];
  selectedFolderId: string | null;
  selectedMediaIds: string[];
  filters: {
    types: MediaType[];
  };
}

const initialState: FolderState = {
  folders: [
    {
      id: "root",
      name: "Your Folder",
      mediaIds: [],
      children: [],
      counts: { image: 0, video: 0, gif: 0 },
    },
    {
      id: "new-folder",
      name: "New Folder",
      mediaIds: [],
      children: [],
      counts: { image: 0, video: 0, gif: 0 },
    },
  ],
  selectedFolderId: "root",
  selectedMediaIds: [],
  filters: { types: ["image", "video", "gif"] },
};

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    selectFolder: (state, action: PayloadAction<string>) => {
      state.selectedFolderId = action.payload;
    },
    toggleMediaSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedMediaIds.indexOf(action.payload);
      if (index === -1) {
        state.selectedMediaIds.push(action.payload);
      } else {
        state.selectedMediaIds.splice(index, 1);
      }
    },
    updateFilters: (state, action: PayloadAction<MediaType[]>) => {
      state.filters.types = action.payload;
    },
    moveMedia: (
      state,
      action: PayloadAction<{ targetFolderId: string; mediaIds?: string[] }>
    ) => {
      const { targetFolderId, mediaIds = state.selectedMediaIds } =
        action.payload;

      const mediaIdSet = new Set(mediaIds);

      state.folders.forEach((folder) => {
        if (folder.id !== targetFolderId) {
          folder.mediaIds = folder.mediaIds.filter((id) => !mediaIdSet.has(id));
        }
      });

      const targetFolder = state.folders.find(
        (folder) => folder.id === targetFolderId
      );
      if (targetFolder) {
        const newMediaIds = [...targetFolder.mediaIds];
        mediaIds.forEach((id) => {
          if (!newMediaIds.includes(id)) {
            newMediaIds.push(id);
          }
        });
        targetFolder.mediaIds = newMediaIds;
      }
      state.selectedMediaIds = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteMedia, (state, action) => {
      const deletedId = action.payload;
      state.folders.forEach((folder) => {
        folder.mediaIds = folder.mediaIds.filter((id) => id !== deletedId);
      });
      state.selectedMediaIds = state.selectedMediaIds.filter(
        (id) => id !== deletedId
      );
    });
  },
});

export const { selectFolder, moveMedia, toggleMediaSelection, updateFilters } =
  folderSlice.actions;
export default folderSlice.reducer;
