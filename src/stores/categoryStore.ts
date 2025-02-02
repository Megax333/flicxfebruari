import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  glow: string | null;
  order: number;
}

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  updateCategories: (categories: Category[]) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,

      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('order');
          
          if (error) throw error;
          
          // Ensure categories are properly ordered
          const sortedCategories = (data || []).sort((a, b) => a.order - b.order);
          set({ categories: sortedCategories });
        } catch (error) {
          console.error('Error fetching categories:', error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      updateCategories: async (categories) => {
        set({ loading: true, error: null });
        try {
          // First update local state to make UI responsive
          set({ categories: categories.map((cat, index) => ({ ...cat, order: index })) });

          // Then update database
          const updates = categories.map((cat, index) => ({
            id: cat.id,
            name: cat.name,
            glow: cat.glow,
            order: index
          }));

          const { error } = await supabase
            .from('categories')
            .upsert(updates, { 
              onConflict: 'id',
              ignoreDuplicates: false 
            });

          if (error) throw error;

          // Fetch fresh data to ensure sync
          await get().fetchCategories();
        } catch (error) {
          console.error('Error updating categories:', error);
          set({ error: error.message });
          // Revert to previous state on error
          await get().fetchCategories();
        } finally {
          set({ loading: false });
        }
      },

      deleteCategory: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          set(state => ({
            categories: state.categories.filter(cat => cat.id !== id)
          }));
        } catch (error) {
          console.error('Error deleting category:', error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'category-store',
      partialize: (state) => ({ categories: state.categories })
    }
  )
);