import { Folder } from "../../features/folder-slice";

export const MediaToolbar = ({ 
  selectedCount,
  folders,
  currentFolder,
  onMoveMedia,
  searchQuery,
  onSearchChange 
}: {
  selectedCount: number;
  folders: Folder[];
  currentFolder?: Folder;
  onMoveMedia: (targetFolderId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) => (
  <div className="mb-4 p-2 rounded flex items-center gap-4">
    <span>{selectedCount} selected</span>
    {selectedCount > 0 && (
      <select
        onChange={(e) => onMoveMedia(e.target.value)}
        className="p-2 rounded border"
      >
        <option value="">{currentFolder?.name || ""}</option>
        {folders
          .filter(folder => folder.id !== currentFolder?.id)
          .map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
      </select>
    )}
    <input
      type="text"
      placeholder="Search by name..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="p-2 rounded border flex-grow"
    />
  </div>
);
