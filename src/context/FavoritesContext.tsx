'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (plantId: string) => boolean;
  toggleFavorite: (plantId: string, plantName?: string) => void;
  clearFavorites: () => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('greenwiki_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem('greenwiki_favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  };

  const isFavorite = (plantId: string): boolean => {
    return favorites.includes(plantId);
  };

  const toggleFavorite = (plantId: string, plantName?: string) => {
    let updated: string[];
    const alreadySaved = favorites.includes(plantId);

    if (alreadySaved) {
      updated = favorites.filter((id) => id !== plantId);
    } else {
      updated = [...favorites, plantId];
    }
    saveFavorites(updated);

    // Dispatch custom event for global notification toast
    if (typeof window !== 'undefined') {
      const detail = {
        message: alreadySaved 
          ? `Removed ${plantName || 'plant'} from your garden` 
          : `Saved ${plantName || 'plant'} to your garden!`,
        type: alreadySaved ? 'info' : 'success',
      };
      window.dispatchEvent(new CustomEvent('greenwiki-toast', { detail }));
    }
  };

  const clearFavorites = () => {
    saveFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        count: isLoaded ? favorites.length : 0,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
