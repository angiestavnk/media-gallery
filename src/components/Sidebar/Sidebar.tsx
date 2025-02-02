import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  Folder,
  MediaType,
  moveMedia,
  selectFolder,
  updateFilters,
} from "../../features/folder-slice";
import { useMemo } from "react";
import { useDrop } from "react-dnd";

// src/components/Sidebar.tsx

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { folders, selectedFolderId } = useSelector(
    (state: RootState) => state.folders
  );
  const filters = useSelector((state: RootState) => state.folders.filters);
  const { media } = useSelector((state: RootState) => state.media);

  // Calculate media type counts for the current folder
  const mediaCounts = useMemo(() => {
    const currentFolder = folders.find((f) => f.id === selectedFolderId);
    return {
      image:
        currentFolder?.mediaIds.filter(
          (id) => media.find((media) => media.id === id)?.type === "image"
        ).length || 0,
      video:
        currentFolder?.mediaIds.filter(
          (id) => media.find((media) => media.id === id)?.type === "video"
        ).length || 0,
      gif:
        currentFolder?.mediaIds.filter(
          (id) => media.find((media) => media.id === id)?.type === "gif"
        ).length || 0,
    };
  }, [folders, selectedFolderId, media]);

  const handleFilterChange = (type: MediaType) => {
    const newFilters = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type) // Remove filter
      : [...filters.types, type]; // Add filter

    dispatch(updateFilters(newFilters));
  };

  const FolderItem = ({ folder }: { folder: Folder }) => {
    const dispatch = useDispatch();
    const [, drop] = useDrop(() => ({
      accept: 'MEDIA',
      drop: (item: { mediaIds: string[] }) => {
        dispatch(moveMedia({
          targetFolderId: folder.id,
          mediaIds: item.mediaIds
        }));
      },
    }));
  
    return (
      <div
        ref={drop}
        className={`ml-2 p-1 rounded ${
          selectedFolderId === folder.id ? 'bg-blue-100' : ''
        } cursor-pointer hover:bg-gray-200`}
        onClick={() => dispatch(selectFolder(folder.id))}
      >
        <span className="flex justify-between">
          {folder.name}
          <span className="text-gray-500">({folder.mediaIds.length})</span>
        </span>
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-100 p-4 h-screen fixed">
      <h1 className="text-xl font-bold mb-6">Media Gallery</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Folders</h2>
        {folders.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Filters</h3>
        {(["image", "video", "gif"] as MediaType[]).map((type) => (
          <label key={type} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.types.includes(type)}
              onChange={() =>
                handleFilterChange(type as "image" | "video" | "gif")
              }
            />
            <span>
              {type.charAt(0).toUpperCase() + type.slice(1)} (
              {mediaCounts[type]})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
