import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router';

interface SortableListItemProps {
  id: string;
  title: string;
}

export default function SortableListItem({ id, title }: SortableListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 border rounded shadow-sm bg-white cursor-grab active:cursor-grabbing"
    >
      <Link to={`/todo/${id}`}>{title}</Link>
    </div>
  );
}
