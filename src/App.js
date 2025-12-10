import React, { useState } from 'react';
import './App.css';
import useTechnologies from './components/useTechnologies';
import ProgressBar from './components/ProgressBar';
import TechnologyCard from './components/TechnologyCard';
import TechnologyNotes from './components/TechnologyNotes';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import Modal from './components/Modal';

function App() {
  const {
    technologies,
    toggleStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    randomNextTechnology,
    resetAllData,
    getStatistics
  } = useTechnologies();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const statistics = getStatistics();

  // Обработчик случайного выбора технологии
  const handleRandomNext = () => {
    const randomId = randomNextTechnology();
    if (randomId) {
      setTimeout(() => {
        const element = document.getElementById(`tech-${randomId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlighted');
          setTimeout(() => element.classList.remove('highlighted'), 2000);
        }
      }, 100);
    }
  };

  // Экспорт данных
  const handleExport = () => {
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        totalTechnologies: statistics.totalCount,
        progress: statistics.progress
      },
      technologies: technologies
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowExportModal(true);
  };

  // Фильтрация и поиск технологий
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="App">
      {/* Модальные окна */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="📊 Детальная статистика"
        size="medium"
      >
        <div className="stats-modal-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{statistics.totalCount}</div>
              <div className="stat-label">Всего технологий</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.completedCount}</div>
              <div className="stat-label">Завершено</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.inProgressCount}</div>
              <div className="stat-label">В процессе</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.notStartedCount}</div>
              <div className="stat-label">Не начато</div>
            </div>
          </div>

          <h3>Прогресс по категориям</h3>
          {Object.entries(statistics.categories).map(([category, data]) => {
            const categoryProgress = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
            return (
              <div key={category} className="category-progress">
                <div className="category-header">
                  <span className="category-name">{getCategoryLabel(category)}</span>
                  <span className="category-stats">
                    {data.completed}/{data.total} ({categoryProgress}%)
                  </span>
                </div>
                <ProgressBar
                  progress={categoryProgress}
                  height={10}
                  showLabel={false}
                  showPercentage={false}
                  color={getCategoryColor(category)}
                />
              </div>
            );
          })}

          <ProgressBar
            progress={statistics.progress}
            label="Общий прогресс"
            animated={true}
            height={20}
            className="progress-bar-success"
          />
        </div>
      </Modal>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="📤 Экспорт данных"
        size="small"
      >
        <div className="export-modal-content">
          <p>✅ Данные успешно экспортированы!</p>
          <p>Файл скачан автоматически в формате JSON.</p>
          <p className="export-hint">
            Всего экспортировано: <strong>{statistics.totalCount}</strong> технологий
          </p>
          <button 
            className="modal-action-btn"
            onClick={() => setShowExportModal(false)}
          >
            Закрыть
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="⚠️ Сброс всех данных"
        size="small"
      >
        <div className="reset-modal-content">
          <p>Вы уверены, что хотите сбросить все данные?</p>
          <p className="reset-warning">
            Это действие нельзя отменить! Будут удалены:
          </p>
          <ul className="reset-list">
            <li>Все статусы прогресса</li>
            <li>Все заметки пользователя</li>
            <li>Вся статистика изучения</li>
          </ul>
          <div className="reset-buttons">
            <button 
              className="modal-action-btn danger"
              onClick={() => {
                resetAllData();
                setShowResetModal(false);
              }}
            >
              Да, сбросить всё
            </button>
            <button 
              className="modal-action-btn secondary"
              onClick={() => setShowResetModal(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Основной контент */}
      <div className="progress-header-wrapper">
        <div className="app-container">
          <header className="app-header">
            <h1>Персональный трекер освоения технологий</h1>
            <div className="main-progress">
              <ProgressBar
                progress={statistics.progress}
                label="Общий прогресс"
                color="#6366f1"
                animated={true}
                height={25}
                showPercentage={true}
              />
              <div className="progress-stats-quick">
                <span>Завершено: {statistics.completedCount}/{statistics.totalCount}</span>
                <button 
                  className="stats-btn"
                  onClick={() => setShowStatsModal(true)}
                  title="Показать детальную статистику"
                >
                  📊 Подробнее
                </button>
              </div>
            </div>
          </header>
        </div>
      </div>
      
      <div className="app-container">
        <div className="control-panel">
          <div className="search-container">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Поиск по названию, описанию или заметкам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  title="Очистить поиск"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="search-stats">
              Найдено: <strong>{filteredTechnologies.length}</strong> из {technologies.length} технологий
              {searchQuery && ` по запросу "${searchQuery}"`}
            </div>
          </div>
          
          <QuickActions 
            onMarkAllCompleted={markAllAsCompleted}
            onResetAll={resetAllStatuses}
            onRandomNext={handleRandomNext}
            onExport={handleExport}
            onResetData={() => setShowResetModal(true)}
            technologies={technologies}
          />
          
          <FilterButtons 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            technologies={technologies}
          />
        </div>
        
        <main className="main-content">
          <h2>Дорожная карта изучения технологий</h2>
          <p className="filter-info">
            {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Все технологии'} | 
            Показано: {filteredTechnologies.length} из {technologies.length} | 
            Фильтр: {getFilterLabel(activeFilter)}
          </p>
          
          <div className="technologies-grid">
            {filteredTechnologies.map(tech => (
              <div key={tech.id} id={`tech-${tech.id}`} className="tech-card-wrapper">
                <TechnologyCard
                  id={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                  category={tech.category}
                  onStatusChange={toggleStatus}
                />
                <TechnologyNotes
                  notes={tech.notes}
                  onNotesChange={updateNotes}
                  techId={tech.id}
                />
              </div>
            ))}
            
            {filteredTechnologies.length === 0 && (
              <div className="no-results">
                <p>😔 Ничего не найдено</p>
                <p className="no-results-hint">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" не найдено ни одной технологии`
                    : 'Нет технологий с выбранным статусом'}
                </p>
                <div className="no-results-actions">
                  <button 
                    className="clear-filter-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                  >
                    Сбросить поиск и фильтры
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <footer className="app-footer">
          <div className="storage-info">
            <span className="storage-icon">💾</span>
            <span>Данные сохраняются автоматически с использованием кастомных хуков</span>
          </div>
          <p className="hint">
            💡 Используйте переиспользуемые компоненты: ProgressBar, Modal, кастомные хуки
          </p>
        </footer>
      </div>
    </div>
  );
}

// Вспомогательные функции
const getFilterLabel = (filter) => {
  const labels = {
    'all': 'Все',
    'not-started': 'Не начатые',
    'in-progress': 'В процессе',
    'completed': 'Завершенные'
  };
  return labels[filter] || filter;
};

const getCategoryLabel = (category) => {
  const labels = {
    'frontend': 'Фронтенд',
    'backend': 'Бэкенд',
    'devops': 'DevOps',
    'quality': 'Качество кода'
  };
  return labels[category] || category;
};

const getCategoryColor = (category) => {
  const colors = {
    'frontend': '#3b82f6',
    'backend': '#10b981',
    'devops': '#8b5cf6',
    'quality': '#f59e0b'
  };
  return colors[category] || '#6b7280';
};

export default App;