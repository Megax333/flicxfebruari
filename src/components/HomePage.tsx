import React, { useEffect } from 'react';
import MovieGrid from './MovieGrid';
import Creators from './Creators';
import AudioRooms from './AudioRooms';
import IntroSection from './IntroSection';
import { useMovieStore } from '../stores/movieStore';

const HomePage = () => {
  const fetchMovies = useMovieStore((state) => state.fetchMovies);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div>
      <MovieGrid />
      <Creators />
      <IntroSection />
      <AudioRooms />
    </div>
  );
};

export default HomePage;