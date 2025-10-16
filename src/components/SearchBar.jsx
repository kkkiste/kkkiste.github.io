import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-8">
      <input
        type="text"
        placeholder="Videos suchen..."
        value={searchTerm}
        onChange={handleChange}
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
      />
      <button
        type="submit"
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
      >
        Suchen
      </button>
    </form>
  );
};

export default SearchBar;

