import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";
import { Folder, moveMedia, selectFolder } from "../../features/folder-slice";

export const FolderItem = ({ 
  folder,
  isSelected
}: {
  folder: Folder;
  isSelected: boolean;
}) => {
  const dispatch = useDispatch();
  
  const [, drop] = useDrop(() => ({
    accept: "MEDIA",
    drop: (item: { mediaIds: string[] }) => {
      dispatch(moveMedia({
        targetFolderId: folder.id,
        mediaIds: item.mediaIds,
      }));
    },
  }));

  return (
    <div
      ref={drop}
      className={`ml-2 p-1 rounded ${
        isSelected ? "bg-blue-100" : ""
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
