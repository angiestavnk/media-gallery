import { useDrag } from "react-dnd";

export const useDragMedia = (itemId: string, selectedMediaIds: string[]) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MEDIA",
    item: () => ({
      mediaIds: selectedMediaIds.includes(itemId) ? selectedMediaIds : [itemId],
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [selectedMediaIds]);

  return { isDragging, drag };
};
