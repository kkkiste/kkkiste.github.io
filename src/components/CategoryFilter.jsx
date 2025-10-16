import React from 'react';

const CategoryFilter = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Kategorien:</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-lg transition-colors duration-300 ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
        >
          Alle
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-full text-lg transition-colors duration-300 ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
          >
            {category.snippet.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

