import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, Save, X, Trash2 } from 'lucide-react';
import { useCategoryStore } from '../../stores/categoryStore';

// Add CSS variables for colors
const style = document.createElement('style');
style.textContent = `
  :root {
    --purple-500: rgb(147, 51, 234);
    --blue-500: rgb(59, 130, 246);
    --green-500: rgb(34, 197, 94);
    --yellow-500: rgb(234, 179, 8);
    --orange-500: rgb(249, 115, 22);
    --red-500: rgb(239, 68, 68);
  }
`;
document.head.appendChild(style);

const CategoryEditor = () => {
  const { categories, fetchCategories, updateCategories, deleteCategory } = useCategoryStore();
  const [localCategories, setLocalCategories] = useState(categories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategories();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(localCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLocalCategories(items);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateCategories(localCategories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setLocalCategories(prev => prev.filter(cat => cat.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleGlowChange = (id, color) => {
    const updatedCategories = localCategories.map(cat => 
      cat.id === id ? { ...cat, glow: color } : cat
    );
    setLocalCategories(updatedCategories);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading categories...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
            <p>Error loading categories: {error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchCategories().finally(() => setLoading(false));
              }}
              className="mt-2 text-sm underline hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No categories found.</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {localCategories.map((category, index) => (
                      <Draggable
                        key={category.id}
                        draggableId={category.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-[#1E1E2A] rounded-xl p-4 flex items-center gap-4"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-gray-400">ID: {category.id}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-2">
                                {['purple', 'blue', 'green', 'yellow', 'orange', 'red'].map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => handleGlowChange(category.id, color)}
                                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                                      category.glow === color ? 'ring-2 ring-white' : ''
                                    }`}
                                    style={{
                                      background: `var(--${color}-500)`,
                                      boxShadow: category.glow === color ? `0 0 10px var(--${color}-500)` : 'none'
                                    }}
                                  />
                                ))}
                                {category.glow && (
                                  <button
                                    onClick={() => handleGlowChange(category.id, null)}
                                    className="w-6 h-6 rounded-full bg-[#2A2A3A] flex items-center justify-center hover:bg-[#3A3A4A]"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="flex justify-end mt-4">
              {error && <p className="text-red-500 text-sm mr-4 my-auto">{error}</p>}
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryEditor;