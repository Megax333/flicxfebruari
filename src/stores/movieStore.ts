import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  preview: string;
  tags: string[];
  order: number;
}

interface MovieStore {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  fetchMovies: () => Promise<void>;
  updateMovie: (movie: Movie) => Promise<void>;
  addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
  removeMovie: (id: string) => Promise<void>;
  reorderMovies: (fromIndex: number, toIndex: number) => Promise<void>;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  movies: [],
  loading: false,
  error: null,

  fetchMovies: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('order');
      
      if (error) throw error;
      set({ movies: data || [] });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateMovie: async (movie) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('movies')
        .update({
          title: movie.title,
          description: movie.description,
          thumbnail: movie.thumbnail,
          preview: movie.preview,
          tags: movie.tags,
          order: movie.order,
          updated_at: new Date().toISOString()
        })
        .eq('id', movie.id);

      if (error) throw error;
      
      // Update local state
      set(state => ({
        movies: state.movies.map(m => m.id === movie.id ? movie : m)
      }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addMovie: async (movie) => {
    set({ loading: true, error: null });
    try {
      // Validate required fields
      if (!movie.title || !movie.thumbnail || !movie.preview) {
        throw new Error('Title, thumbnail and preview are required');
      }

      // Get max order
      const maxOrder = Math.max(...get().movies.map(m => m.order || 0), -1) + 1;

      const { data, error } = await supabase
        .from('movies')
        .insert([{ 
          ...movie,
          order: maxOrder,
          tags: movie.tags || [],
          description: movie.description || ''
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      if (data) {
        set(state => ({
          movies: [...state.movies, data]
        }));
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      set({ error: error.message || 'Failed to add movie' });
    } finally {
      set({ loading: false });
    }
  },

  removeMovie: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      set(state => ({
        movies: state.movies.filter(m => m.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  reorderMovies: async (fromIndex: number, toIndex: number) => {
    const movies = [...get().movies];
    const [movedMovie] = movies.splice(fromIndex, 1);
    movies.splice(toIndex, 0, movedMovie);

    const updatedMovies = movies.map((movie, index) => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      thumbnail: movie.thumbnail,
      preview: movie.preview,
      tags: movie.tags,
      order: index
    }));

    set({ loading: true, error: null });
    try {
      // Update all movies with new order values
      const { error } = await supabase
        .from('movies')
        .upsert(updatedMovies);

      if (error) throw error;
      
      // Update local state
      set({ movies: updatedMovies });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }
}));