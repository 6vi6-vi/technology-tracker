import { useState, useEffect } from 'react';
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

  const handleDelete = () => {
    if (tech) {
      updateTechnology(tech.id, { notes: '' });
      setNotes('');
    }
    setShowDeleteModal(false);
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
          ←  Назад
        </button>
      </div>

      <div className="detail-content">
        <div className="main-info">
          <div className="title-with-status">
            <h1 className="detail-title">{tech.title}</h1>
            <span 
              className="detail-status-indicator"
              style={{ 
                backgroundColor: getStatusColor(tech.status),
                color: 'white'
              }}
            >
              {getStatusText(tech.status)}
            </span>
          </div>

          <div className="description-section">
            <h3 className="description-title">Описание</h3>
            <div className="description-content">
              <p className="detail-description">{tech.description}</p>
            </div>
          </div>
          

          {/* Полезные ссылки */}
          {tech.links && tech.links.length > 0 && (
            <div className="links-section">
              <h3>Полезные ссылки</h3>
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
            <h3>Мои заметки</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-textarea"
              placeholder="Записывайте здесь важные моменты, команды, ссылки..."
              rows="8"
            />
            <div className="notes-controls">
              <span className="char-count">{notes.length} символов</span>
              <div className="note-actions">
                <button 
                  className="delete-note-btn"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Удалить
                </button>
                <button className="save-note-btn" onClick={handleSaveNotes}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>

          {/* Сроки */}
          <div className="panel-section due-date-section">
            <h3>Срок выполнения</h3>
            <div className="due-date-input">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="date-picker"
              />
              <button className="save-btn" onClick={handleSaveDueDate}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно удаления */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удаление заметок"
        size="small"
      >
        <div className="delete-modal-content">
          <p>Вы уверены, что хотите удалить все заметки для этой технологии?</p>
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