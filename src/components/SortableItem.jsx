import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, show, rank }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    willChange: 'transform',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-gradient-to-r from-white to-gray-50
        border-2 border-gray-300 rounded-xl p-4
        cursor-grab active:cursor-grabbing
        select-none
        ${isDragging ? 'shadow-2xl border-cn-blue' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cn-pink to-cn-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
          {rank}
        </div>
        <div className="flex-shrink-0 text-4xl">
          {show.image}
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg text-gray-800">{show.title}</h3>
          <p className="text-sm text-gray-600">{show.years}</p>
        </div>
        <div className="flex-shrink-0 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>
    </div>
  );
};
