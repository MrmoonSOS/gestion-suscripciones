import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Buscar por servicio, categoría o notas..."
          value={searchTerm}
          onChange={handleChange}
          className="search-input"
        />
        
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={clearSearch}
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
        
        <div className="search-icon">
          🔍
        </div>
      </div>
      
      {searchTerm && (
        <div className="search-info">
          Buscando: "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;