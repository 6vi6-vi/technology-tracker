import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TechnologyCard.css';

const TechnologyCard = ({ 
  id, 
  title, 
  description, 
  status, 
  dueDate,
  onStatusChange 
}) => {
  const navigate = useNavigate();
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // Функция для изменения статуса
  const handleStatusChange = () => {
  if (!onStatusChange) return;
  
  // Меняем статус 
  onStatusChange(id);
  
  // Запускаем анимацию
  setIsChangingStatus(true);
  
  // Останавливаем анимацию 
  const timer = setTimeout(() => {
    setIsChangingStatus(false);
  });
  
  // Очищаем таймер при размонтировании компонента
  return () => clearTimeout(timer);
};

  // Функция для перехода на страницу деталей
  const handleViewDetails = (e) => {
    e.stopPropagation(); // Останавливаем всплытие
    navigate(`/technology/${id}`);
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
          statusClass: 'status-completed',
          textColor: '#065f46',
          hoverColor: '#d1fae5'
        };
      case 'in-progress':
        return { 
          borderColor: '#f59e0b', 
          icon: '⏳', 
          bgColor: '#fffbeb',
          statusText: 'В процессе',
          statusClass: 'status-in-progress',
          textColor: '#92400e',
          hoverColor: '#fef3c7'
        };
      case 'not-started':
        return { 
          borderColor: '#ef4444', 
          icon: '⭕', 
          bgColor: '#fef2f2',
          statusText: 'Не начато',
          statusClass: 'status-not-started',
          textColor: '#991b1b',
          hoverColor: '#fee2e2'
        };
      default:
        return { 
          borderColor: '#d1d5db', 
          icon: '❓', 
          bgColor: '#f9fafb',
          statusText: 'Неизвестно',
          statusClass: 'status-unknown',
          textColor: '#4b5563',
          hoverColor: '#f3f4f6'
        };
    }
  };


  // Функция для отображения срока выполнения
  const renderDueDate = () => {
    if (!dueDate) {
      return (
        <div className="due-date-indicator not-set">
          <span className="due-date-text">Дедлайн не установлен</span>
        </div>
      );
  }
    
    const today = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    let className = 'due-date-indicator';
    let text = `До ${due.toLocaleDateString('ru-RU')}`;
    
    if (status === 'completed') {
      className += ' completed';
      text = `Завершено ${due.toLocaleDateString('ru-RU')}`;
    } else if (daysLeft < 0) {
      className += ' overdue';
      text = `Просрочено ${Math.abs(daysLeft)} д. назад`;
    } else if (daysLeft === 0) {
      className += ' upcoming';
      text = 'Дедлайн сегодня!';
    } else if (daysLeft <= 5) {
      className += ' upcoming';
      text = `${daysLeft} д. до дедлайна`;
    } else {
      className += ' normal';
      text = `${daysLeft} д. до дедлайна`;
    }
    
    return (
      <div className={className} title={`Дедлайн: ${due.toLocaleDateString('ru-RU')}`}>
        <span className="due-date-text">{text}</span>
      </div>
    );
  };


  const statusStyles = getStatusStyles();
  const nextStatus = getNextStatus(status);
  const nextStatusText = nextStatus === 'in-progress' ? 'В процессе' : 
                         nextStatus === 'completed' ? 'Завершено' : 'Не начато';

  return (
    <div 
      className={`technology-card ${statusStyles.statusClass} ${isChangingStatus ? 'status-changing' : ''}`}
      onClick={handleStatusChange}
      style={{ 
        borderColor: statusStyles.borderColor,
        backgroundColor: statusStyles.bgColor 
      }}
    >
      
      
      <div className="card-header">
        <span className="status-icon">{statusStyles.icon}</span>
        <div>
          <h3 className="card-title">{title}</h3>
          <div className="status-indicator">
            <div className="card-extra-info">
              {renderDueDate()}
            </div>
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
        </div>
      </div>

      {/* Кнопка просмотра деталей */}
      <button 
        className={`details-btn details-btn-${status}`} // Добавляем класс статуса
        onClick={handleViewDetails}
      >
        Детали
      </button>
    </div>
  );
};

export default TechnologyCard;