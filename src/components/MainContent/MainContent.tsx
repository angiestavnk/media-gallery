// src/components/MainContent.tsx
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  toggleMediaSelection,
  moveMedia,
  MediaType,
} from "../../features/folder-slice";
import { useEffect } from "react";
import { setMedia } from "../../features/media-slice";
import { MediaItem } from "../MediaItem/MediaItem";

export const MainContent = () => {
  const dispatch = useDispatch();
  const { selectedFolderId, folders, selectedMediaIds, filters } = useSelector(
    (state: RootState) => state.folders
  );
  const { media } = useSelector((state: RootState) => state.media);

  // Fetch media from API on component mount
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("https://picsum.photos/v2/list?limit=30");
        const data = await response.json();

        // Transform API data to MediaItems
        const mediaItems = data.map(
          (item: { id: number; download_url: string }, index: number) => ({
            id: `img-${item.id}`,
            name: `Image ${index + 1}`,
            type: "image" as MediaType,
            url: item.download_url,
          })
        );

        // Add mock video and gif items for demonstration
        const mockItems = [
          ...mediaItems,
          {
            id: "vid-1",
            name: "Sample Video",
            type: "video" as MediaType,
            url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
          },
          {
            id: "gif-1",
            name: "Sample GIF",
            type: "gif" as MediaType,
            url: "https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif",
          },
        ];

        dispatch(setMedia(mockItems));

        // Add media to root folder
        dispatch(
          moveMedia({
            targetFolderId: "root",
            mediaIds: mockItems.map((item) => item.id),
          })
        );
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, [dispatch]);

  const currentFolder = folders.find((f) => f.id === selectedFolderId);
  const filteredMedia = (currentFolder?.mediaIds || [])
    .map((id) => media.find((m) => m.id === id))
    .filter((m) => m && filters.types.includes(m.type));

  return (
    <div className="ml-64 p-6">
      {selectedMediaIds.length > 0 && (
        <div className="mb-4 p-2 bg-blue-100 rounded flex items-center">
          <span className="mr-4">{selectedMediaIds.length} selected</span>
          <select
            onChange={(e) =>
              dispatch(moveMedia({ targetFolderId: e.target.value }))
            }
            className="p-2 rounded border"
          >
            <option value="">Move to...</option>
            {folders
              .filter((folder) => folder.id !== selectedFolderId) // Filter out the current folder
              .map((folder, idx) => (
                <option key={idx} value={folder.id}>
                  {folder.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {filteredMedia.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          Your folder is empty
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filteredMedia.map(
            (item) =>
              item && (
                <MediaItem
                  key={item.id}
                  item={item}
                  isSelected={selectedMediaIds.includes(item.id)}
                  selectedMediaIds={selectedMediaIds} // This is crucial
                  onToggle={(id) => dispatch(toggleMediaSelection(id))}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};
