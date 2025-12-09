import './SearchBox.css';

const SearchBox = ({ searchQuery, onSearchChange, resultCount, totalCount }) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="search-box">
      <div className="search-header">
        <h3>🔍 Поиск технологий</h3>
        <div className="search-stats">
          <span className="stats-found">
            Найдено: <strong>{resultCount}</strong> из {totalCount}
          </span>
          {resultCount < totalCount && (
            <span className="stats-percentage">
              ({Math.round((resultCount / totalCount) * 100)}%)
            </span>
          )}
        </div>
      </div>
      
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по названию, описанию или заметкам..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        
        {searchQuery && (
          <button 
            className="clear-search-btn"
            onClick={handleClearSearch}
            title="Очистить поиск"
          >
            ✕
          </button>
        )}
        
        <div className="search-hints">
          <span className="hint">💡 Ищет в названии, описании и заметках</span>
          <span className="hint">🎯 Работает вместе с фильтром статусов</span>
        </div>
      </div>
      
      {searchQuery && (
        <div className="search-results-info">
          <p>
            Результаты по запросу: "<strong>{searchQuery}</strong>"
          </p>
          <div className="search-tips">
            <span className="tip">📌 Совет: используйте несколько слов для точного поиска</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;