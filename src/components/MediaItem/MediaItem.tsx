import { MediaType } from "../../features/folder-slice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useDragMedia } from "../../services/drag-media-service/use-drag-media";
import {
  handleDeleteMedia,
  handleRenameMedia,
} from "../../services/media-service/media-service";

interface MediaItemProps {
  item: {
    id: string;
    name: string;
    type: MediaType;
    url: string;
    width: number;
    height: number;
  };
  isSelected: boolean;
  selectedMediaIds: string[];
  onToggle: (id: string) => void;
}

export const MediaItem = ({
  item,
  isSelected,
  selectedMediaIds,
  onToggle,
}: MediaItemProps) => {
  const dispatch = useDispatch();
  const [isRenaming, setIsRenaming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const selectionIndex = selectedMediaIds.indexOf(item.id) + 1;

  const { isDragging, drag } = useDragMedia(item.id, selectedMediaIds);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteMedia(item.id, dispatch);
  };

  const handleRename = () => {
    handleRenameMedia(item.id, newName, dispatch);
    setIsRenaming(false);
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
  };

  return (
    <div
      ref={drag}
      className={`overflow-hidden relative cursor-move group ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } ${isDragging ? "opacity-50" : ""}`}
      onClick={() => onToggle(item.id)}
    >
      {isSelected && (
        <div
          className="absolute bottom-2 left-2 w-6 h-6 bg-blue-500 text-white 
                        flex items-center justify-center rounded-sm text-sm"
        >
          {selectionIndex}
        </div>
      )}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10 hover:bg-red-600"
      >
        ×
      </button>
      <div className="relative h-48">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        )}

        {item.type === "video" ? (
          <video
            className="w-full h-full object-contain"
            controls
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
            controlsList="nodownload"
          >
            <source src={item.url} type="video/mp4" />
          </video>
        ) : (
          <img
            src={item.url}
            alt={item.name}
            className={`w-full h-full object-contain ${
              loaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            style={{ aspectRatio: `${item.width}/${item.height}` }}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
      <div className="flex justify-center p-2">
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === "Enter" && handleRename()}
            className="text-sm w-full focus:outline-none"
            autoFocus
          />
        ) : (
          <p
            className="text-sm truncate cursor-text hover:underline"
            onClick={handleNameClick}
          >
            {item.name}
          </p>
        )}
      </div>
    </div>
  );
};
