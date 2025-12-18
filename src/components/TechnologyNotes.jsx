import React, { useState } from 'react';
import './TechnologyNotes.css';

const TechnologyNotes = ({ notes, onNotesChange, techId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    
    // Автосохранение с задержкой (дебаунсинг)
    if (window.notesSaveTimeout) {
      clearTimeout(window.notesSaveTimeout);
    }
    
    window.notesSaveTimeout = setTimeout(() => {
      onNotesChange(techId, newNotes);
    }, 500);
  };

  const handleSave = () => {
    onNotesChange(techId, localNotes);
  };

  const handleClear = () => {
    if (window.confirm('Удалить заметку?')) {
      setLocalNotes('');
      onNotesChange(techId, '');
    }
  };

  return (
    <div className={`technology-notes ${isExpanded ? 'expanded' : ''}`}>
      <div className="notes-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="notes-title">
          <span className="notes-icon">📝</span>
          <h4>Мои заметки</h4>
        </div>
        <div className="notes-actions">
          <span className="notes-status">
            {localNotes ? `(${localNotes.length} симв.)` : 'Добавить заметку'}
          </span>
          <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="notes-content">
          <textarea
            className="notes-textarea"
            value={localNotes}
            onChange={handleNotesChange}
            placeholder="Записывайте сюда важные моменты, команды, ссылки или мысли..."
            rows="4"
            maxLength="1000"
          />
          
          <div className="notes-controls">
            <div className="notes-info">
              <span className="char-count">
                {localNotes.length}/1000 символов
              </span>
              <span className="save-status">
                {localNotes === notes ? '✓ Сохранено' : '… Сохранение…'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyNotes;