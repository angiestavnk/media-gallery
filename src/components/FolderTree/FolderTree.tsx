import { useDispatch, useSelector } from "react-redux";
import { selectFolder } from '../../features/folder-slice'
import { RootState } from "../../app/store";

const FolderTree = () => {
  const dispatch = useDispatch();
  const folders = useSelector((state: RootState) => state.folders.folders);

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="font-bold mb-4">Folders</h2>
      <ul>
        {/* Render list of folders */}
        {folders.map((folder) => (
          <li
            key={folder.id}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
            // Dispatch action when a folder is clicked
            onClick={() => dispatch(selectFolder(folder.id))}
          >
            {folder.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderTree;
