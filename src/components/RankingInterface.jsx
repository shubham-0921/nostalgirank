import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const RankingInterface = ({ shows, onSubmit, onBack, prompt }) => {
  const [items, setItems] = useState(shows);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    onSubmit(items);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          {prompt && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-4 mb-4 inline-block">
              <p className="text-sm opacity-90 mb-1">Your Custom Game</p>
              <p className="text-lg font-bold">"{prompt}"</p>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-cn-black mb-2">
            Rank Your Favorites
          </h1>
          <p className="text-lg text-gray-700">
            Drag and drop to arrange from favorite (top) to least favorite (bottom)
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {items.map((show, index) => (
                  <SortableItem key={show.id} id={show.id} show={show} rank={index + 1} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="text-center space-y-3">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-cn-pink to-cn-blue hover:from-cn-blue hover:to-cn-pink text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Submit My Ranking
          </button>
          {onBack && (
            <div>
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 text-sm underline"
              >
                ← Back to prompt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingInterface;
