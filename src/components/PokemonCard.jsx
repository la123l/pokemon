import React, { useEffect, useState } from 'react';
import { getCollection, saveCollection } from '../utils/localStorageUtils';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

export default function PokemonCard({ name, url }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);

  const addToCollection = async () => {
    const collection = getCollection();

    const alreadyExists = collection.some(p => p.name === name);
    if (!alreadyExists) {
      const res = await fetch(url);
      const data = await res.json();
      const pokemonToSave = {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map(t => t.type.name),
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat
        }
      };
      collection.push(pokemonToSave);
      saveCollection(collection);
      toast.success(`${name.toUpperCase()} added to your collection!`);
    } else {
      toast.info(`${name.toUpperCase()} is already in your collection!`);
    }
  };

  if (!data) return null;

  return (
    <div style={{
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      marginBottom: '15px',
      background: '#f8f8f8',
      position: 'relative',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    }}>
      <button
        onClick={addToCollection}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'transparent',
          border: 'none',
          color: '#281eb8ff',
          fontSize: '16px',
          cursor: 'pointer'
        }}
        title="Add to Collection"
      >
        <FaPlus />
      </button>

      <img src={data.sprites.other['official-artwork'].front_default} alt={name} width="100" style={{ display: 'block' }} />
      <h3 style={{  marginTop: '10px' }}>{name.toUpperCase()}</h3>
      <p style={{  margin: '5px 0' }}>Types: {data.types.map(t => t.type.name).join(', ')}</p>
      <p style={{  margin: '5px 0' }}>
        HP: {data.stats[0].base_stat}, ATK: {data.stats[1].base_stat}, DEF: {data.stats[2].base_stat}
      </p>
    </div>
  );
}
