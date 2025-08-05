import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SortableItem = ({ id, pokemon, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    marginBottom: '15px',
    background: '#f8f8f8',
    position: 'relative',
    cursor: 'grab',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  };

  const deleteButtonStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'transparent',
    border: 'none',
    color: '#e74c3c',
    fontSize: '14px',
    cursor: 'pointer',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        onClick={() => onDelete(id)}
        style={deleteButtonStyle}
        title="Remove from collection"
      >
        <FaTrash />
      </button>
      <img src={pokemon.image} alt={pokemon.name} width="100" style={{ display: 'block', }} />
      <h3 style={{ marginTop: '10px' }}>{pokemon.name.toUpperCase()}</h3>
      <p style={{ margin: '5px 0' }}>Types: {pokemon.types.join(', ')}</p>
      <p style={{ margin: '5px 0' }}>
        HP: {pokemon.stats.hp}, ATK: {pokemon.stats.attack}, DEF: {pokemon.stats.defense}
      </p>
    </div>
  );
};

const Collection = () => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('pokemon-collection');
    if (saved) setCollection(JSON.parse(saved));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = collection.findIndex((p) => p.id === active.id);
      const newIndex = collection.findIndex((p) => p.id === over.id);
      const newOrder = arrayMove(collection, oldIndex, newIndex);
      setCollection(newOrder);
      localStorage.setItem('pokemon-collection', JSON.stringify(newOrder));
    }
  };

  const handleDelete = (id) => {
    const removed = collection.find((p) => p.id === id);
    const updated = collection.filter((p) => p.id !== id);
    setCollection(updated);
    localStorage.setItem('pokemon-collection', JSON.stringify(updated));
    toast.info(`${removed.name.toUpperCase()} removed from your collection.`);
  };

  return (
    <div>
      <h2 >My Pokémon Collection</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={collection.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {collection.map((pokemon) => (
            <SortableItem
              key={pokemon.id}
              id={pokemon.id}
              pokemon={pokemon}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Collection;
