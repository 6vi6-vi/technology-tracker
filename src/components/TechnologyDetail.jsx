import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TechnologyDetail.css';
import Modal from '../components/Modal';

const TechnologyDetail = ({ technologies, updateTechnology, onBack }) => {
  const { id } = useParams();
  const [tech, setTech] = useState(null);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const technology = technologies.find(t => t.id === parseInt(id));
    if (technology) {
      setTech(technology);
      setNotes(technology.notes || '');
      setDueDate(technology.dueDate || '');
      setEditTitle(technology.title);
      setEditDescription(technology.description);
    }
  }, [id, technologies]);

  const handleSaveNotes = () => {
    if (tech) {
      updateTechnology(tech.id, { notes });
    }
  };

  const handleSaveDueDate = () => {
    if (tech) {
      updateTechnology(tech.id, { dueDate });
    }
  };

  const handleStatusChange = () => {
    if (tech) {
      const statusOrder = ['not-started', 'in-progress', 'completed'];
      const currentIndex = statusOrder.indexOf(tech.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      updateTechnology(tech.id, { status: statusOrder[nextIndex] });
    }
  };

  const handleDelete = () => {
    // Здесь можно добавить логику удаления, если нужно
    setShowDeleteModal(false);
    onBack();
  };

  const handleSaveEdit = () => {
    if (tech) {
      updateTechnology(tech.id, {
        title: editTitle,
        description: editDescription
      });
      setIsEditing(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'not-started': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      case 'not-started': return 'Не начато';
      default: return 'Неизвестно';
    }
  };

  if (!tech) {
    return (
      <div className="technology-detail not-found">
        <h2>Технология не найдена</h2>
        <Link to="/" className="back-link">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="technology-detail">
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          ← Назад
        </button>
        <div className="header-actions">
          <button 
            className={`status-button status-${tech.status}`}
            onClick={handleStatusChange}
          >
            {getStatusText(tech.status)}
          </button>
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            ✎ Редактировать
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="main-info">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="edit-title-input"
                placeholder="Название технологии"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="edit-description-input"
                placeholder="Описание технологии"
                rows="4"
              />
              <div className="edit-actions">
                <button className="save-edit-btn" onClick={handleSaveEdit}>
                  💾 Сохранить
                </button>
                <button className="cancel-edit-btn" onClick={() => setIsEditing(false)}>
                  ❌ Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="detail-title">{tech.title}</h1>
              <p className="detail-description">{tech.description}</p>
              
              <div className="detail-meta">
                <div className="meta-item">
                  <span className="meta-label">Статус:</span>
                  <span 
                    className="meta-value status-badge"
                    style={{ backgroundColor: getStatusColor(tech.status) }}
                  >
                    {getStatusText(tech.status)}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">ID:</span>
                  <span className="meta-value">{tech.id}</span>
                </div>
              </div>
            </>
          )}

          {/* Полезные ссылки */}
          {tech.links && tech.links.length > 0 && (
            <div className="links-section">
              <h3>📚 Полезные ссылки</h3>
              <div className="links-list">
                {tech.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-item"
                  >
                    <span className="link-icon">🔗</span>
                    <div className="link-content">
                      <span className="link-title">{link.title}</span>
                      <span className="link-url">{link.url}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="side-panel">
          {/* Заметки */}
          <div className="panel-section notes-section">
            <h3>📝 Мои заметки</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-textarea"
              placeholder="Записывайте здесь важные моменты, команды, ссылки..."
              rows="8"
            />
            <div className="notes-controls">
              <span className="char-count">{notes.length} символов</span>
              <button className="save-btn" onClick={handleSaveNotes}>
                💾 Сохранить
              </button>
            </div>
          </div>

          {/* Сроки */}
          <div className="panel-section due-date-section">
            <h3>📅 Срок выполнения</h3>
            <div className="due-date-input">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="date-picker"
              />
              <button className="save-btn" onClick={handleSaveDueDate}>
                💾 Сохранить дату
              </button>
            </div>
            {dueDate && (
              <div className="due-date-info">
                <p>Дедлайн: <strong>{new Date(dueDate).toLocaleDateString('ru-RU')}</strong></p>
                <p className="days-left">
                  Осталось дней: {Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            )}
          </div>

          {/* Дополнительные действия */}
          <div className="panel-section actions-section">
            <h3>⚡ Действия</h3>
            <div className="action-buttons">
              <button className="action-btn mark-completed" onClick={handleStatusChange}>
                Изменить статус
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                🗑️ Удалить заметки
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно удаления */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="🗑️ Удаление заметок"
        size="small"
      >
        <div className="delete-modal-content">
          <p>Вы уверены, что хотите удалить все заметки для этой технологии?</p>
          <p className="warning-text">Это действие нельзя отменить.</p>
          <div className="delete-actions">
            <button className="confirm-delete-btn" onClick={handleDelete}>
              Да, удалить
            </button>
            <button className="cancel-delete-btn" onClick={() => setShowDeleteModal(false)}>
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TechnologyDetail;