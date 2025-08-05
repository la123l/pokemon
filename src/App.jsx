import React, { useState } from 'react';
import PokemonList from './components/PokemonList';
import Collection from './components/Collection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [tab, setTab] = useState('discover');

  return (
    <>

      <div>
        <h1>Pokemon App</h1>
        <div className="tabs">
          <button
            className={`tab-button ${tab === 'discover' ? 'active' : ''}`}
            onClick={() => setTab('discover')}
          >
            Discover
          </button>
          <button
            className={`tab-button ${tab === 'collection' ? 'active' : ''}`}
            onClick={() => setTab('collection')}
          >
            My Collection
          </button>
        </div>

        <div>
          {tab === 'discover' ? <PokemonList /> : <Collection />}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}