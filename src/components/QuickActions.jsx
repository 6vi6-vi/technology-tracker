import React, { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

const QuickActions = ({ 
  onMarkAllCompleted, 
  onResetAll, 
  onRandomNext, 
  onExport,
  onResetData,
  technologies 
}) => {
  const [showQuickHelp, setShowQuickHelp] = useState(false);

  const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
  const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
  const completedCount = technologies.filter(tech => tech.status === 'completed').length;

  return (
    <div className="quick-actions">
      <div className="actions-header">
        <h3>Быстрые действия</h3>
        <button 
          className="help-btn"
          onClick={() => setShowQuickHelp(true)}
          title="Помощь по быстрым действиям"
        >
          ?
        </button>
      </div>
      
      <div className="actions-grid">
        <button 
          className="action-btn action-complete"
          onClick={onMarkAllCompleted}
          disabled={completedCount === technologies.length}
        >
          <span className="action-icon">🏁</span>
          <span className="action-text">Отметить все как выполненные</span>
          <span className="action-count">{completedCount}/{technologies.length}</span>
        </button>
        
        <button 
          className="action-btn action-reset"
          onClick={onResetAll}
          disabled={notStartedCount === technologies.length}
        >
          <span className="action-icon">🔄</span>
          <span className="action-text">Сбросить все статусы</span>
          <span className="action-count">{notStartedCount} не начато</span>
        </button>
        
        <button 
          className="action-btn action-random"
          onClick={onRandomNext}
          disabled={notStartedCount === 0}
        >
          <span className="action-icon">🎲</span>
          <span className="action-text">Случайный выбор следующей</span>
          <span className="action-count">{notStartedCount} доступно</span>
        </button>
        
        <button 
          className="action-btn action-export"
          onClick={onExport}
        >
          <span className="action-icon">📤</span>
          <span className="action-text">Экспорт данных</span>
          <span className="action-count">JSON</span>
        </button>
        
        <button 
          className="action-btn action-danger"
          onClick={onResetData}
        >
          <span className="action-icon">🗑️</span>
          <span className="action-text">Сбросить все данные</span>
          <span className="action-count">Осторожно!</span>
        </button>
      </div>
      
      <div className="status-summary">
        <div className="summary-item">
          <span className="summary-dot not-started"></span>
          <span>Не начато: {notStartedCount}</span>
        </div>
        <div className="summary-item">
          <span className="summary-dot in-progress"></span>
          <span>В процессе: {inProgressCount}</span>
        </div>
        <div className="summary-item">
          <span className="summary-dot completed"></span>
          <span>Завершено: {completedCount}</span>
        </div>
      </div>

      {/* Модальное окно помощи */}
      <Modal
        isOpen={showQuickHelp}
        onClose={() => setShowQuickHelp(false)}
        title="🛠️ Помощь по быстрым действиям"
        size="medium"
      >
        <div className="help-content">
          <h4>Доступные действия:</h4>
          <ul className="help-list">
            <li>
              <strong>Отметить все как выполненные</strong> - устанавливает статус "Завершено" для всех технологий
            </li>
            <li>
              <strong>Сбросить все статусы</strong> - возвращает все технологии к статусу "Не начато"
            </li>
            <li>
              <strong>Случайный выбор следующей</strong> - случайно выбирает не начатую технологию и меняет её статус на "В процессе"
            </li>
            <li>
              <strong>Экспорт данных</strong> - скачивает все ваши данные в формате JSON
            </li>
            <li>
              <strong>Сбросить все данные</strong> - полностью очищает все настройки и заметки (действие необратимо)
            </li>
          </ul>
          <p className="help-tip">
            💡 Все изменения автоматически сохраняются в вашем браузере
          </p>
          <button 
            className="modal-action-btn"
            onClick={() => setShowQuickHelp(false)}
          >
            Понятно
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default QuickActions;