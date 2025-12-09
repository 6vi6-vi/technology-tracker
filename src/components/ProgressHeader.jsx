import React from 'react';
import './ProgressHeader.css';

const ProgressHeader = ({ technologies = [] }) => {
  const totalCount = technologies.length;
  const completedCount = technologies.filter(tech => tech.status === 'completed').length;
  const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
  
  const completionPercentage = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;

  // Определение самой популярной категории
  const getMostPopularCategory = () => {
    const categories = ['React Basics', 'State Management', 'Advanced Concepts'];
    const categoryCounts = {
      'React Basics': 4,
      'State Management': 3,
      'Advanced Concepts': 3
    };
    
    let maxCount = 0;
    let popularCategory = '';
    
    for (const [category, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        popularCategory = category;
      }
    }
    
    return { category: popularCategory, count: maxCount };
  };

  const popularCategory = getMostPopularCategory();

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="progress-header">
      <div className="progress-container">
        <div className="progress-stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{totalCount}</div>
              <div className="stat-label">Всего тем</div>
            </div>
          </div>
          
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{completedCount}</div>
              <div className="stat-label">Завершено</div>
              <div className="stat-percentage">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </div>
            </div>
          </div>
          
          <div className="stat-card in-progress">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{inProgressCount}</div>
              <div className="stat-label">В процессе</div>
            </div>
          </div>
          
          <div className="stat-card not-started">
            <div className="stat-icon">⭕</div>
            <div className="stat-content">
              <div className="stat-value">{notStartedCount}</div>
              <div className="stat-label">Не начато</div>
            </div>
          </div>
          
          <div className="stat-card popular">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{popularCategory.category}</div>
              <div className="stat-label">Популярная категория</div>
              <div className="stat-detail">{popularCategory.count} тем</div>
            </div>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-info">
            <h3>Общий прогресс</h3>
            <div className="percentage-display">
              <span className="percentage-value">{completionPercentage}%</span>
              <span className="percentage-label">
                {completionPercentage === 100 ? 'Полное завершение!' : 
                 completionPercentage >= 70 ? 'Отличные результаты!' :
                 completionPercentage >= 40 ? 'Хороший прогресс!' : 'Начинаем путь!'}
              </span>
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar"
              style={{ 
                width: `${completionPercentage}%`,
                backgroundColor: getProgressBarColor(completionPercentage)
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;