import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const CategoryFilter = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground">Kategorien:</h3>
        {selectedCategory && (
          <Badge variant="secondary" className="text-xs">
            {categories.find(cat => cat.id === selectedCategory)?.snippet.title}
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onSelectCategory(null)}
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          className={`rounded-full transition-all duration-300 ${
            !selectedCategory 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md' 
              : 'hover:border-primary hover:text-primary'
          }`}
        >
          Alle
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className={`rounded-full transition-all duration-300 ${
              selectedCategory === category.id 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md' 
                : 'hover:border-primary hover:text-primary'
            }`}
          >
            {category.snippet.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

