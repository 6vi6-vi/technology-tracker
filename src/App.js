import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import useTechnologies from './components/useTechnologies';
import TechnologyDetail from './components/TechnologyDetail';
import JsonUploader from './components/JsonUploader';
import TechnologyCard from './components/TechnologyCard';
import ProgressBar from './components/ProgressBar';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import Modal from './components/Modal';

function App() {
  const {
    technologies,
    toggleStatus,
    updateNotes,
    updateDueDate,
    loadNewData,
    markAllAsCompleted,
    resetAllStatuses,
    randomNextTechnology,
    resetAllData,
    clearAllNotes,
    clearAllDueDates,
    getStatistics,
    exportData
  } = useTechnologies();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();

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

  // Обработчик загрузки новой дорожной карты
  const handleDataLoaded = (newData, roadmapInfo) => {
    loadNewData(newData, roadmapInfo);
    setShowImportModal(false);
    alert(`Дорожная карта "${roadmapInfo.title}" успешно загружена!`);
  };

  // Обработчик экспорта данных
  const handleExport = () => {
    const data = exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `tech-tracker-${new Date().toISOString().split('T')[0]}.json`;
    
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
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Импорт дорожной карты"
        size="large"
      >
        <JsonUploader onDataLoaded={handleDataLoaded} />
      </Modal>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
        size="small"
      >
        <div className="export-modal-content">
          <p>Данные успешно экспортированы!</p>
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
            <li>Все установленные сроки</li>
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

      {/* Роутинг */}
      <Routes>
        <Route path="/" element={
          <>
            {/* Шапка с прогрессом */}
            <div className="progress-header-wrapper">
              <div className="app-header">
                <header className="app-container">
                  <div className="header-main">
                    <h1>Трекер освоения технологий</h1>
                  </div>
                  <div className="main-progress">
                    <ProgressBar
                      progress={statistics.progress}
                      label="Общий прогресс"
                      color="#3d8fe8ff"
                      labelColor='#ffffffff'
                      animated={true}
                      height={25}
                      showPercentage={true}
                    />
                  </div>
                </header>
              </div>
            </div>
            
            {/* Основной контент */}
            <div className="app-container">
              <div className="control-panel">
                {/* Поиск */}
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
                
                
                {/* Фильтры */}
                <FilterButtons 
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  technologies={technologies}
                />
              </div>
              
              {/* Основной контент - карточки */}
              <main className="main-content">
                <div className="content-header">
                  <h2>Дорожная карта изучения</h2>
                  <div className="content-actions">
                    <button 
                      className="import-btn"
                      onClick={() => setShowImportModal(true)}
                    >
                      Импортировать карту
                    </button>
                    <button 
                      className="export-btn"
                      onClick={handleExport}
                    >
                      Экспортировать данные
                    </button>
                  </div>
                </div>
                
                <div className="technologies-grid">
                  {filteredTechnologies.map(tech => (
                    <div key={tech.id} id={`tech-${tech.id}`} className="tech-card-wrapper">
                      <TechnologyCard
                        id={tech.id}
                        title={tech.title}
                        description={tech.description}
                        status={tech.status}
                        
                        dueDate={tech.dueDate}
                        links={tech.links}
                        onStatusChange={toggleStatus}
                      />
                    </div>
                  ))}
                </div>
              </main>

              <div className="control-panel">
                {/* Быстрые действия */}
                <QuickActions 
                  onMarkAllCompleted={markAllAsCompleted}
                  onResetAll={resetAllStatuses}
                  onRandomNext={handleRandomNext}
                  onExport={handleExport}
                  onImport={() => setShowImportModal(true)}
                  onResetData={() => setShowResetModal(true)}
                  onClearNotes={clearAllNotes}
                  onClearDueDates={clearAllDueDates}
                  technologies={technologies}
                />
              </div>
            </div>

            {/* Футер */}
              <footer className="app-footer">
              </footer>
          </>
        } />
        
        <Route 
          path="/technology/:id" 
          element={
            <TechnologyDetail
              technologies={technologies}
              updateTechnology={(id, updates) => {
                // Обновляем технологию через существующие функции
                if (updates.notes !== undefined) updateNotes(id, updates.notes);
                if (updates.dueDate !== undefined) updateDueDate(id, updates.dueDate);
                if (updates.status !== undefined) {
                  // Для смены статуса нужно использовать toggleStatus
                  // Но в TechnologyDetail это обрабатывается отдельно
                }
              }}
              onBack={() => navigate('/')}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;