import React, { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import PokemonCard from './PokemonCard';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const fetchPokemon = async ({ pageParam = 0 }) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=6&offset=${pageParam}`);
  return res.json();
};

export default function PokemonList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['pokemon'],
    queryFn: fetchPokemon,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) return allPages.length * 6;
      return undefined;
    },
  });


  const loadMoreRef = useRef();
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Error fetching data</p>}
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.results.map((pokemon) => (
            <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
          ))}
        </React.Fragment>
      ))}
      <div ref={loadMoreRef}>{isFetchingNextPage ? 'Loading more...' : ''}</div>
    </div>
  );
}