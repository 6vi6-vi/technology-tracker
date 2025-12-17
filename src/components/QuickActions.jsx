import './QuickActions.css';

const QuickActions = ({ 
  onMarkAllCompleted, 
  onResetAll, 
  onRandomNext, 
  onResetData,
  technologies 
}) => {
  const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
  const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
  const completedCount = technologies.filter(tech => tech.status === 'completed').length;

  return (
    <div className="quick-actions">
      <div className="actions-header">
        <h3>Быстрые действия</h3>
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
      </div>
    </div>
  );
};

export default QuickActions;