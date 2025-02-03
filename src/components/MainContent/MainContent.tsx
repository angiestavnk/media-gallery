import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  toggleMediaSelection,
  moveMedia,
  selectFolder,
} from "../../features/folder-slice";
import { useEffect, useState } from "react";
import { setMedia } from "../../features/media-slice";
import { MediaItem } from "../MediaItem/MediaItem";
import EmptyState from "../EmptyState/EmptyState";
import { MediaToolbar } from "../MediaToolbar/MediaToolbar";
import { FetchMediaService } from "../../services/fetch-media/fetch-media";

export const MainContent = () => {
  const dispatch = useDispatch();
  const { selectedFolderId, folders, selectedMediaIds, filters } = useSelector(
    (state: RootState) => state.folders
  );
  const { media } = useSelector((state: RootState) => state.media);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const initializeMedia = async () => {
      const mediaItems = await FetchMediaService.fetchMedia();
      dispatch(setMedia(mediaItems));
      dispatch(
        moveMedia({
          targetFolderId: "root",
          mediaIds: mediaItems.map(item => item.id),
        })
      );
    };
    
    initializeMedia();
  }, [dispatch]);


  const currentFolder = folders.find((f) => f.id === selectedFolderId);
  const filteredMedia = (currentFolder?.mediaIds || [])
    .map((id) => media.find((m) => m.id === id))
    .filter((m) => m && filters.types.includes(m.type))
    .filter((m) => m?.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleMoveMedia = (targetFolderId: string) => {
    if (!targetFolderId) return;

    dispatch(
      moveMedia({
        targetFolderId,
        mediaIds: selectedMediaIds,
      })
    );

    dispatch(selectFolder(targetFolderId));
  };

  return (
    <div className="flex-1 p-6 flex-grow">
      <MediaToolbar
        selectedCount={selectedMediaIds.length}
        folders={folders}
        currentFolder={currentFolder}
        onMoveMedia={handleMoveMedia}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {filteredMedia.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-6 gap-4">
          {filteredMedia.map(
            (item) =>
              item && (
                <MediaItem
                  key={item.id}
                  item={item}
                  isSelected={selectedMediaIds.includes(item.id)}
                  selectedMediaIds={selectedMediaIds}
                  onToggle={(id) => dispatch(toggleMediaSelection(id))}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};
