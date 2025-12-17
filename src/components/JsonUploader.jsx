import { useRef, useState } from 'react';
import './JsonUploader.css';

const JsonUploader = ({ onDataLoaded }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверка расширения файла
    if (!file.name.endsWith('.json')) {
      setError('Пожалуйста, выберите файл в формате JSON');
      return;
    }

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const data = JSON.parse(content);
        
        // Валидация структуры JSON
        if (!validateRoadmapStructure(data)) {
          throw new Error('Некорректная структура файла. Файл должен содержать поля "title" и "items"');
        }
        
        // Преобразуем данные к нужному формату
        const convertedData = convertToAppFormat(data);
        onDataLoaded(convertedData, {
          title: data.title,
          description: data.description || '',
          author: data.author || 'Пользователь',
          version: data.version || '1.0'
        });
        
        // Очищаем input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Очищаем ошибку через 3 секунды
        setTimeout(() => {
          setError('');
          setFileName('');
        }, 3000);
        
      } catch (err) {
        setError(`Ошибка загрузки файла: ${err.message}`);
      }
    };
    
    reader.onerror = () => {
      setError('Ошибка чтения файла');
    };
    
    reader.readAsText(file);
  };

  // Валидация формата
  const validateRoadmapStructure = (data) => {
    return data && 
           typeof data === 'object' &&
           data.title && 
           Array.isArray(data.items);
  };

  // Преобразование в формат приложения
  const convertToAppFormat = (data) => {
    return data.items.map((item, index) => ({
      id: item.id || index + 1,
      title: item.title || `Тема ${index + 1}`,
      description: item.description || '',
      status: item.status || 'not-started', // сохраняем статус при импорте
      notes: item.notes || '',
      links: item.links || [],
      dueDate: item.dueDate || null,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      // roadmap будет добавлен в родительском компоненте
    }));
  };

  const handleExampleLoad = () => {
    const exampleRoadmap = {
      title: "Изучение React.js",
      description: "Дорожная карта для освоения React.js от основ до продвинутых тем",
      author: "я",
      version: "1.0",
      items: [
        {
          id: 1,
          title: "Основы JavaScript",
          description: "Освойте базовый синтаксис JavaScript, прежде чем переходить к React",
          links: [
            { title: "Современный учебник JavaScript", url: "https://learn.javascript.ru/?ysclid=mj95ualxhi706466108" },
            { title: "Руководство по JavaScript", url: "https://metanit.com/web/javascript/?ysclid=mj95yfgecq963100361" }
          ]
        },
        {
          id: 2,
          title: "React Components",
          description: "Изучение компонентов, props и базового синтаксиса JSX",
          links: [
            { title: "React Docs: Components", url: "https://react.dev/reference/react/Component" }
          ]
        },
        {
          id: 3,
          title: "State и Props",
          description: "Работа с состоянием компонентов и передачей данных",
          links: [
            { title: "React State", url: "https://ru.react.js.org/docs/faq-state.html" }
          ]
        },
        {
          id: 4,
          title: "React Hooks",
          description: "Изучение хуков: useState, useEffect, useContext и других",
          links: [
            { title: "React Hooks", url: "https://react.dev/reference/react/hooks" }
          ]
        },
        {
          id: 5,
          title: "React Router",
          description: "Настройка маршрутизации в React приложении",
          links: [
            { title: "React Router Docs", url: "https://reactrouter.com/" }
          ]
        },
        {
          id: 6,
          title: "State Management",
          description: "Управление состоянием с Redux, Context API",
          links: [
            { title: "Redux и MobX", url: "https://result.school/media/chto-takoe-menedzhery-sostoyanij-i-zachem-razrabotchiku-ih-ispolzovat" },
            { title: "Context API", url: "https://www.geeksforgeeks.org/reactjs/mastering-state-management-in-reactjs-a-beginners-guide-to-the-context-api/?ysclid=mj96a01e9o968281166" }
          ]
        },
        {
          id: 7,
          title: "Testing",
          description: "Тестирование React компонентов с Jest и React Testing Library",
          links: [
            { title: "Настройка Jest и React Testing Library", url: "https://habr.com/ru/articles/920988/?ysclid=mj96bfydrj820857455" },
          ]
        },
        {
          id: 8,
          title: "Performance",
          description: "Оптимизация производительности React-приложений",
          links: [
            { title: "React Performance", url: "https://habr.com/ru/companies/ruvds/articles/442650/?ysclid=mj96cpzwf3540254668" }
          ]
        }
      ]
    };

    const convertedData = convertToAppFormat(exampleRoadmap);
    onDataLoaded(convertedData, {
      title: exampleRoadmap.title,
      description: exampleRoadmap.description,
      author: exampleRoadmap.author,
      version: exampleRoadmap.version
    });
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName('');
    setError('');
  };

  return (
    <div className="json-uploader">
      <div className="upload-controls">
        <div className="file-upload-area">
          {/* Скрытый файловый инпут */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json,application/json"
            className="file-input"
            style={{ display: 'none' }}
          />
          {/* Кнопка выбора файла */}
          <button 
            className="upload-btn"
            onClick={handleUploadButtonClick}
          >
            Выбрать JSON-файл
          </button>
        </div>

        <div className="divider">
          <span className="divider-text">или</span>
        </div>

        <button className="example-btn" onClick={handleExampleLoad}>
          Загрузить пример дорожной карты
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="format-info">
        <h4>Требуемый формат JSON-файла:</h4>
        <div className="format-requirements">
          <p>Файл должен содержать следующие поля:</p>
          <ul className="requirements-list">
            <li><strong>title</strong> — название дорожной карты (обязательно)</li>
            <li><strong>description</strong> — описание дорожной карты</li>
            <li><strong>items</strong> — массив элементов для изучения (обязательно)</li>
          </ul>
        </div>
        
        <div className="format-example">
          <h5>Пример структуры:</h5>
          <pre className="json-example">
{`{
  "title": "Название дорожной карты",
  "description": "Описание",
  "author": "Автор (опционально)",
  "version": "1.0 (опционально)",
  "items": [
    {
      "id": 1,
      "title": "Название темы",
      "description": "Описание темы",
      "status": "not-started",
      "notes": "Заметки пользователя",
      "links": [
        {
          "title": "Название ссылки",
          "url": "https://example.com"
        }
      ],
      "dueDate": "2024-12-31",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}`}</pre>
        </div>
      </div>
    </div>
  );
};

export default JsonUploader;