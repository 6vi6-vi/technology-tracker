import React, { useState, useEffect } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';

function App() {
  // Начальное состояние технологий
  const [technologies, setTechnologies] = useState([
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов React и их жизненного цикла', status: 'not-started' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX и его отличий от HTML', status: 'not-started' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов и хуками', status: 'not-started' },
    { id: 4, title: 'React Router', description: 'Настройка маршрутизации в React приложении', status: 'not-started' },
    { id: 5, title: 'Context API', description: 'Использование Context для глобального состояния', status: 'not-started' },
    { id: 6, title: 'Hooks', description: 'Изучение всех встроенных хуков React', status: 'not-started' },
    { id: 7, title: 'Component Lifecycle', description: 'Понимание жизненного цикла компонентов', status: 'not-started' },
    { id: 8, title: 'React Testing', description: 'Тестирование React компонентов', status: 'not-started' },
    { id: 9, title: 'Performance Optimization', description: 'Оптимизация производительности React приложений', status: 'not-started' },
    { id: 10, title: 'Server Side Rendering', description: 'Изучение SSR с Next.js', status: 'not-started' }
  ]);

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');

  // Функция для изменения статуса технологии
  const handleStatusChange = (id) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => {
        if (tech.id === id) {
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  // Функция для отметки всех как выполненных
  const markAllAsCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'not-started' }))
    );
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

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  return (
    <div className="App">
      <ProgressHeader technologies={technologies} />
      
      <div className="app-container">
        <header className="app-header">
          <h1>Персональный трекер освоения технологий</h1>
          <p>Кликайте на карточки для изменения статуса изучения</p>
        </header>
        
        <div className="control-panel">
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
        </div>
        
        <main className="main-content">
          <h2>Дорожная карта изучения React</h2>
          <p className="filter-info">
            Показано: {filteredTechnologies.length} из {technologies.length} технологий
            {activeFilter !== 'all' && ` (фильтр: ${getFilterLabel(activeFilter)})`}
          </p>
          
          <div className="technologies-grid">
            {filteredTechnologies.map(tech => (
              <TechnologyCard
                key={tech.id}
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                onStatusChange={handleStatusChange}
              />
            ))}
            
            {filteredTechnologies.length === 0 && (
              <div className="no-results">
                <p>Нет технологий с выбранным статусом</p>
                <button 
                  className="clear-filter-btn"
                  onClick={() => setActiveFilter('all')}
                >
                  Показать все технологии
                </button>
              </div>
            )}
          </div>
        </main>
        
        <footer className="app-footer">
          <p>Используйте карточки для отслеживания прогресса изучения React</p>
          <p className="hint">💡 Кликайте на карточки для изменения статуса</p>
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