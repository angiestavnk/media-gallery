// src/components/MediaItem.tsx
import { useDrag } from 'react-dnd';
import { MediaType } from '../../features/folder-slice';

interface MediaItemProps {
  item: {
    id: string;
    name: string;
    type: MediaType;
    url: string;
  };
  isSelected: boolean;
  selectedMediaIds: string[];
  onToggle: (id: string) => void;
}

export const MediaItem = ({ item, isSelected, selectedMediaIds, onToggle }: MediaItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MEDIA',
    item: () => ({
      mediaIds: selectedMediaIds.includes(item.id) 
        ? selectedMediaIds 
        : [item.id]
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(item.id);
  };

  return (
    <div
      ref={drag}
      className={`border rounded-lg overflow-hidden relative cursor-move ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onToggle(item.id)}
    >
      <input
        type="checkbox"
        checked={isSelected}
        className="absolute top-2 left-2"
        onChange={() => {}}
        onClick={handleCheckboxClick}
      />
      {item.type === 'video' ? (
        <video src={item.url} className="w-full h-48 object-cover" controls />
      ) : (
        <img src={item.url} alt={item.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-2">
        <p className="text-sm truncate">{item.name}</p>
        <span className="text-xs text-gray-500">{item.type}</span>
      </div>
    </div>
  );
};
