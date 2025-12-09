import React from 'react';
import './TechnologyCard.css';

const TechnologyCard = ({ id, title, description, status, onStatusChange }) => {
  // Функция для обработки клика по карточке
  const handleClick = () => {
    if (onStatusChange) {
      onStatusChange(id);
    }
  };

  // Функция для получения следующего статуса
  const getNextStatus = (currentStatus) => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  };

  // Функция для получения стилей по статусу
  const getStatusStyles = () => {
    switch(status) {
      case 'completed':
        return { 
          borderColor: '#10b981', 
          icon: '✅', 
          bgColor: '#f0fdf4',
          statusText: 'Завершено',
          statusClass: 'status-completed'
        };
      case 'in-progress':
        return { 
          borderColor: '#f59e0b', 
          icon: '⏳', 
          bgColor: '#fffbeb',
          statusText: 'В процессе',
          statusClass: 'status-in-progress'
        };
      case 'not-started':
        return { 
          borderColor: '#ef4444', 
          icon: '⭕', 
          bgColor: '#fef2f2',
          statusText: 'Не начато',
          statusClass: 'status-not-started'
        };
      default:
        return { 
          borderColor: '#d1d5db', 
          icon: '❓', 
          bgColor: '#f9fafb',
          statusText: 'Неизвестно',
          statusClass: 'status-unknown'
        };
    }
  };

  const statusStyles = getStatusStyles();
  const nextStatus = getNextStatus(status);
  const nextStatusText = getNextStatus(status) === 'in-progress' ? 'В процессе' : 
                         getNextStatus(status) === 'completed' ? 'Завершено' : 'Не начато';

  return (
    <div 
      className={`technology-card ${statusStyles.statusClass}`}
      onClick={handleClick}
      style={{ 
        borderColor: statusStyles.borderColor,
        backgroundColor: statusStyles.bgColor 
      }}
      title={`Кликните чтобы изменить статус на "${nextStatusText}"`}
    >
      <div className="card-header">
        <span className="status-icon">{statusStyles.icon}</span>
        <div>
          <h3 className="card-title">{title}</h3>
          <div className="status-indicator">
            <span className="current-status">{statusStyles.statusText}</span>
            <span className="next-status-hint">→ {nextStatusText}</span>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <p className="card-description">{description}</p>
      </div>
      
      <div className="card-footer">
        <div className="status-display">
          <span className={`status-badge ${statusStyles.statusClass}`}>
            {statusStyles.statusText}
          </span>
          <span className="click-hint">Кликните для смены статуса</span>
        </div>
        <span className="card-id">ID: {id}</span>
      </div>
    </div>
  );
};

export default TechnologyCard;