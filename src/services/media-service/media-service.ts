import { Dispatch } from "react";
import { deleteMedia, renameMedia } from "../../features/media-slice";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDeleteMedia = (id: string, dispatch: Dispatch<any>) => {
  dispatch(deleteMedia(id));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleRenameMedia = (id: string, newName: string, dispatch: Dispatch<any>) => {
  if (newName.trim()) {
    dispatch(renameMedia({ id, newName: newName.trim() }));
  }
};
