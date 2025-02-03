import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { MediaType, updateFilters } from "../../features/folder-slice";
import { useMemo } from "react";
import { FolderItem } from "../FolderItem/FolderItem";
import { AvatarSvg } from "../../assets/Avatar";

const FILTER_TYPES: MediaType[] = ["image", "video", "gif"];

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { folders, selectedFolderId, filters } = useSelector(
    (state: RootState) => state.folders
  );
  const { media } = useSelector((state: RootState) => state.media);

  const mediaCounts = useMemo(() => {
    const currentFolder = folders.find(
      (folder) => folder.id === selectedFolderId
    );
    if (!currentFolder) return { image: 0, video: 0, gif: 0 };

    const mediaMap = new Map(
      media.map((mediaItem) => [mediaItem.id, mediaItem])
    );

    return currentFolder.mediaIds.reduce(
      (counts, mediaId) => {
        const mediaType = mediaMap.get(mediaId)?.type;
        if (mediaType && counts[mediaType] !== undefined) {
          counts[mediaType]++;
        }
        return counts;
      },
      { image: 0, video: 0, gif: 0 }
    );
  }, [folders, selectedFolderId, media]);

  const handleFilterChange = (type: MediaType) => {
    const newFilters = filters.types.includes(type)
      ? filters.types.filter((filterType) => filterType !== type)
      : [...filters.types, type];
    dispatch(updateFilters(newFilters));
  };

  return (
    <div className="w-64 p-4 h-screen fixed bg-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <AvatarSvg />
        <h1 className="text-xl font-bold">Media Gallery</h1>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Folders</h2>
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isSelected={selectedFolderId === folder.id}
          />
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Filters</h3>
        {FILTER_TYPES.map((type) => (
          <label key={type} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={filters.types.includes(type)}
              onChange={() => handleFilterChange(type)}
              className="form-checkbox h-4 w-4"
            />
            <span className="text-sm">
              {type.charAt(0).toUpperCase() + type.slice(1)} (
              {mediaCounts[type]})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
