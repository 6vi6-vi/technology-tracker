import React, { useState, useEffect } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import TechnologyNotes from './components/TechnologyNotes';

function App() {
  // Начальные данные
  const initialTechnologies = [
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов React и их жизненного цикла', status: 'not-started', notes: '' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX и его отличий от HTML', status: 'not-started', notes: '' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов и хуками', status: 'not-started', notes: '' },
    { id: 4, title: 'React Router', description: 'Настройка маршрутизации в React приложении', status: 'not-started', notes: '' },
    { id: 5, title: 'Context API', description: 'Использование Context для глобального состояния', status: 'not-started', notes: '' },
    { id: 6, title: 'Hooks', description: 'Изучение всех встроенных хуков React', status: 'not-started', notes: '' },
    { id: 7, title: 'Component Lifecycle', description: 'Понимание жизненного цикла компонентов', status: 'not-started', notes: '' },
    { id: 8, title: 'React Testing', description: 'Тестирование React компонентов', status: 'not-started', notes: '' },
    { id: 9, title: 'Performance Optimization', description: 'Оптимизация производительности React приложений', status: 'not-started', notes: '' },
    { id: 10, title: 'Server Side Rendering', description: 'Изучение SSR с Next.js', status: 'not-started', notes: '' }
  ];

  // Состояние технологий с загрузкой из localStorage
  const [technologies, setTechnologies] = useState(() => {
    const saved = localStorage.getItem('techTrackerData');
    return saved ? JSON.parse(saved) : initialTechnologies;
  });

  // Состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');

  // Автосохранение в localStorage
  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    console.log('📁 Данные сохранены в localStorage:', technologies.length, 'технологий');
  }, [technologies]);

  // Функция для изменения статуса технологии
  const handleStatusChange = (id) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => {
        if (tech.id === id) {
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          const newStatus = statusOrder[nextIndex];
          
          console.log(`🔄 Технология "${tech.title}" изменена на статус: ${newStatus}`);
          return { ...tech, status: newStatus };
        }
        return tech;
      })
    );
  };

  // Функция для изменения заметок
  const updateTechnologyNotes = (techId, newNotes) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
    console.log(`📝 Заметки обновлены для технологии ID: ${techId}`);
  };

  // Функция для отметки всех как выполненных
  const markAllAsCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'completed' }))
    );
    console.log('✅ Все технологии отмечены как выполненные');
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'not-started' }))
    );
    console.log('🔄 Все статусы сброшены');
  };

  // Функция для случайного выбора следующей технологии
  const randomNextTechnology = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTech.length > 0) {
      const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
      const randomId = randomTech.id;
      
      setTechnologies(prevTech => 
        prevTech.map(tech => 
          tech.id === randomId ? { ...tech, status: 'in-progress' } : tech
        )
      );
      
      console.log(`🎲 Случайно выбрана технология: "${randomTech.title}"`);
      
      // Прокрутка к выбранной технологии
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

  // Функция для сброса всех данных
  const resetAllData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные? Все заметки и статусы будут удалены.')) {
      localStorage.removeItem('techTrackerData');
      setTechnologies(initialTechnologies);
      setSearchQuery('');
      setActiveFilter('all');
      console.log('🗑️ Все данные сброшены к начальному состоянию');
    }
  };

  // Функция для экспорта данных
  const exportData = () => {
    const dataStr = JSON.stringify(technologies, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'tech-tracker-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('📤 Данные экспортированы в файл');
  };

  // Фильтрация и поиск технологий
  const filteredTechnologies = technologies.filter(tech => {
    // Применяем поиск
    const matchesSearch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Применяем фильтр по статусу
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="App">
      <ProgressHeader technologies={technologies} />
      
      <div className="app-container">
        <header className="app-header">
          <h1>Персональный трекер освоения технологий</h1>
          <p>Данные автоматически сохраняются в вашем браузере</p>
        </header>
        
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
            onRandomNext={randomNextTechnology}
            technologies={technologies}
          />
          
          <FilterButtons 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            technologies={technologies}
          />
          
          <div className="data-management">
            <button className="data-btn export-btn" onClick={exportData}>
              📤 Экспорт данных
            </button>
            <button className="data-btn reset-btn" onClick={resetAllData}>
              🗑️ Сбросить все
            </button>
          </div>
        </div>
        
        <main className="main-content">
          <h2>Дорожная карта изучения React</h2>
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
                  onStatusChange={handleStatusChange}
                />
                <TechnologyNotes
                  notes={tech.notes}
                  onNotesChange={updateTechnologyNotes}
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
            <span>Данные сохраняются автоматически в вашем браузере</span>
            <span className="storage-hint">(localStorage)</span>
          </div>
          <p className="hint">💡 Кликайте на карточки для изменения статуса, добавляйте заметки к технологиям</p>
        </footer>
      </div>
    </div>
  );
}

// Вспомогательная функция для получения названия фильтра
const getFilterLabel = (filter) => {
  const labels = {
    'all': 'Все',
    'not-started': 'Не начатые',
    'in-progress': 'В процессе',
    'completed': 'Завершенные'
  };
  return labels[filter] || filter;
};

export default App;