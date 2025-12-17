import './FilterButtons.css';

const FilterButtons = ({ activeFilter, onFilterChange, technologies }) => {
  const filters = [
    { id: 'all', label: 'Все', icon: '📋' },
    { id: 'not-started', label: 'Не начатые', icon: '⭕' },
    { id: 'in-progress', label: 'В процессе', icon: '⏳' },
    { id: 'completed', label: 'Завершённые', icon: '✅' }
  ];

  // Подсчет количества для каждого фильтра
  const getCount = (filterId) => {
    if (filterId === 'all') return technologies.length;
    return technologies.filter(tech => tech.status === filterId).length;
  };

  return (
    <div className="filter-buttons">
      <h3>Фильтр по статусу</h3>
      
      <div className="filters-grid">
        {filters.map(filter => {
          const count = getCount(filter.id);
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              className={`filter-btn ${filter.id} ${isActive ? 'active' : ''}`}
               data-filter={filter.id}
              onClick={() => onFilterChange(filter.id)}
              disabled={count === 0 && filter.id !== 'all'}
            >
              <span className="filter-icon">{filter.icon}</span>
              <span className="filter-label">{filter.label}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterButtons;