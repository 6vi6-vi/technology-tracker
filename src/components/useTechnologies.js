import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение базовых компонентов React и их жизненного цикла', 
    status: 'not-started',
    notes: '',
    category: 'frontend',
    links: [
      { title: 'React Documentation', url: 'https://reactjs.org/docs/components-and-props.html' },
      { title: 'React Components Tutorial', url: 'https://www.w3schools.com/react/react_components.asp' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'React Learning Path',
      description: 'Complete React.js learning roadmap',
      author: 'React Community',
      version: '1.0'
    }
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX и его отличий от HTML', 
    status: 'not-started',
    notes: '',
    category: 'frontend',
    links: [
      { title: 'JSX Introduction', url: 'https://reactjs.org/docs/introducing-jsx.html' },
      { title: 'JSX Deep Dive', url: 'https://reactjs.org/docs/jsx-in-depth.html' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'React Learning Path',
      description: 'Complete React.js learning roadmap',
      author: 'React Community',
      version: '1.0'
    }
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов и хуками', 
    status: 'not-started',
    notes: '',
    category: 'frontend',
    links: [
      { title: 'React State and Lifecycle', url: 'https://reactjs.org/docs/state-and-lifecycle.html' },
      { title: 'Hooks API Reference', url: 'https://reactjs.org/docs/hooks-reference.html' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'React Learning Path',
      description: 'Complete React.js learning roadmap',
      author: 'React Community',
      version: '1.0'
    }
  },
  { 
    id: 4, 
    title: 'React Router', 
    description: 'Настройка маршрутизации в React приложении', 
    status: 'not-started',
    notes: '',
    category: 'frontend',
    links: [
      { title: 'React Router Docs', url: 'https://reactrouter.com/' },
      { title: 'React Router Tutorial', url: 'https://reactrouter.com/docs/en/v6/getting-started/tutorial' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'React Learning Path',
      description: 'Complete React.js learning roadmap',
      author: 'React Community',
      version: '1.0'
    }
  },
  { 
    id: 5, 
    title: 'Context API', 
    description: 'Использование Context для глобального состояния', 
    status: 'not-started',
    notes: '',
    category: 'frontend',
    links: [
      { title: 'React Context', url: 'https://reactjs.org/docs/context.html' },
      { title: 'Context API Guide', url: 'https://www.freecodecamp.org/news/react-context-api-explained/' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'React Learning Path',
      description: 'Complete React.js learning roadmap',
      author: 'React Community',
      version: '1.0'
    }
  },
  { 
    id: 6, 
    title: 'Node.js Basics', 
    description: 'Основы серверного JavaScript', 
    status: 'not-started',
    notes: '',
    category: 'backend',
    links: [
      { title: 'Node.js Official Docs', url: 'https://nodejs.org/en/docs/' },
      { title: 'Node.js Tutorial', url: 'https://www.w3schools.com/nodejs/' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'Full-Stack Learning Path',
      description: 'Full stack web development roadmap',
      author: 'Node.js Community',
      version: '1.0'
    }
  },
  { 
    id: 7, 
    title: 'Express Framework', 
    description: 'Создание REST API с помощью Express', 
    status: 'not-started',
    notes: '',
    category: 'backend',
    links: [
      { title: 'Express.js Documentation', url: 'https://expressjs.com/' },
      { title: 'Express Guide', url: 'https://expressjs.com/en/guide/routing.html' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'Full-Stack Learning Path',
      description: 'Full stack web development roadmap',
      author: 'Node.js Community',
      version: '1.0'
    }
  },
  { 
    id: 8, 
    title: 'Database Integration', 
    description: 'Подключение и работа с базами данных', 
    status: 'not-started',
    notes: '',
    category: 'backend',
    links: [
      { title: 'MongoDB with Node.js', url: 'https://www.mongodb.com/docs/drivers/node/current/' },
      { title: 'PostgreSQL with Node.js', url: 'https://node-postgres.com/' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'Full-Stack Learning Path',
      description: 'Full stack web development roadmap',
      author: 'Node.js Community',
      version: '1.0'
    }
  },
  { 
    id: 9, 
    title: 'Deployment', 
    description: 'Деплой приложений на сервер', 
    status: 'not-started',
    notes: '',
    category: 'devops',
    links: [
      { title: 'Deploy Node.js Apps', url: 'https://vercel.com/guides/deploying-nodejs-with-vercel' },
      { title: 'Docker for Node.js', url: 'https://nodejs.org/en/docs/guides/nodejs-docker-webapp/' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'DevOps Learning Path',
      description: 'DevOps and deployment roadmap',
      author: 'DevOps Community',
      version: '1.0'
    }
  },
  { 
    id: 10, 
    title: 'Testing', 
    description: 'Написание тестов для приложений', 
    status: 'not-started',
    notes: '',
    category: 'quality',
    links: [
      { title: 'Jest Testing Framework', url: 'https://jestjs.io/' },
      { title: 'React Testing Library', url: 'https://testing-library.com/docs/react-testing-library/intro/' }
    ],
    dueDate: '',
    createdAt: new Date().toISOString(),
    roadmap: {
      title: 'Quality Assurance Path',
      description: 'Testing and quality assurance roadmap',
      author: 'QA Community',
      version: '1.0'
    }
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);
  const [activeRoadmap, setActiveRoadmap] = useLocalStorage('activeRoadmap', {
    title: 'Mixed Technologies',
    description: 'Combined learning path with multiple technologies',
    author: 'System',
    version: '1.0'
  });

  // Функция для обновления конкретной технологии
  const updateTechnology = useCallback((techId, updates) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, ...updates, updatedAt: new Date().toISOString() } : tech
      )
    );
  }, [setTechnologies]);

  // Циклическое изменение статуса
  const toggleStatus = useCallback((techId) => {
    setTechnologies(prev => 
      prev.map(tech => {
        if (tech.id === techId) {
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { 
            ...tech, 
            status: statusOrder[nextIndex],
            updatedAt: new Date().toISOString()
          };
        }
        return tech;
      })
    );
  }, [setTechnologies]);

  // Обновление заметок
  const updateNotes = useCallback((techId, notes) => {
    updateTechnology(techId, { notes });
  }, [updateTechnology]);

  // Обновление даты выполнения
  const updateDueDate = useCallback((techId, dueDate) => {
    updateTechnology(techId, { dueDate });
  }, [updateTechnology]);

  // Добавление ссылки
  const addLink = useCallback((techId, link) => {
    const tech = technologies.find(t => t.id === techId);
    if (tech) {
      const newLinks = [...(tech.links || []), { ...link, id: Date.now() }];
      updateTechnology(techId, { links: newLinks });
    }
  }, [technologies, updateTechnology]);

  // Удаление ссылки
  const removeLink = useCallback((techId, linkIndex) => {
    const tech = technologies.find(t => t.id === techId);
    if (tech && tech.links) {
      const newLinks = tech.links.filter((_, index) => index !== linkIndex);
      updateTechnology(techId, { links: newLinks });
    }
  }, [technologies, updateTechnology]);

  // Загрузка новой дорожной карты
  const loadNewData = useCallback((newData, roadmapInfo) => {
    // Добавляем roadmap к каждой технологии
    const enrichedData = newData.map((item) => ({
      ...item,
      roadmap: roadmapInfo || activeRoadmap
    }));
    
    setTechnologies(enrichedData);
    if (roadmapInfo) {
      setActiveRoadmap(roadmapInfo);
    }
  }, [setTechnologies, setActiveRoadmap, activeRoadmap]);

  // Отметить все как выполненные
  const markAllAsCompleted = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ 
        ...tech, 
        status: 'completed',
        updatedAt: new Date().toISOString()
      }))
    );
  }, [setTechnologies]);

  // Сбросить все статусы
  const resetAllStatuses = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ 
        ...tech, 
        status: 'not-started',
        updatedAt: new Date().toISOString()
      }))
    );
  }, [setTechnologies]);

  // Случайный выбор следующей технологии
  const randomNextTechnology = useCallback(() => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTech.length > 0) {
      const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
      const randomId = randomTech.id;
      
      setTechnologies(prev => 
        prev.map(tech => 
          tech.id === randomId ? { 
            ...tech, 
            status: 'in-progress',
            updatedAt: new Date().toISOString()
          } : tech
        )
      );
      
      return randomId;
    }
    return null;
  }, [technologies, setTechnologies]);

  // Сбросить все данные к начальному состоянию
  const resetAllData = useCallback(() => {
    setTechnologies(initialTechnologies);
    setActiveRoadmap({
      title: 'Mixed Technologies',
      description: 'Combined learning path with multiple technologies',
      author: 'System',
      version: '1.0'
    });
  }, [setTechnologies, setActiveRoadmap]);

  // Удалить все заметки
  const clearAllNotes = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ 
        ...tech, 
        notes: '',
        updatedAt: new Date().toISOString()
      }))
    );
  }, [setTechnologies]);

  // Удалить все даты выполнения
  const clearAllDueDates = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ 
        ...tech, 
        dueDate: '',
        updatedAt: new Date().toISOString()
      }))
    );
  }, [setTechnologies]);

  // Получить общую статистику
  const getStatistics = useCallback(() => {
    const totalCount = technologies.length;
    const completedCount = technologies.filter(tech => tech.status === 'completed').length;
    const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
    
    // Статистика по категориям
    const categories = {};
    technologies.forEach(tech => {
      const category = tech.category || 'general';
      if (!categories[category]) {
        categories[category] = { total: 0, completed: 0 };
      }
      categories[category].total++;
      if (tech.status === 'completed') {
        categories[category].completed++;
      }
    });

    // Прогресс
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Технологии с просроченными дедлайнами
    const overdueTech = technologies.filter(tech => {
      if (!tech.dueDate || tech.status === 'completed') return false;
      const dueDate = new Date(tech.dueDate);
      const today = new Date();
      return dueDate < today;
    });

    // Технологии с ближайшими дедлайнами (в течение 7 дней)
    const upcomingTech = technologies.filter(tech => {
      if (!tech.dueDate || tech.status === 'completed') return false;
      const dueDate = new Date(tech.dueDate);
      const today = new Date();
      const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    });

    return {
      totalCount,
      completedCount,
      inProgressCount,
      notStartedCount,
      categories,
      progress,
      overdueCount: overdueTech.length,
      upcomingCount: upcomingTech.length,
      overdueTech: overdueTech.map(tech => ({ id: tech.id, title: tech.title, dueDate: tech.dueDate })),
      upcomingTech: upcomingTech.map(tech => ({ id: tech.id, title: tech.title, dueDate: tech.dueDate, daysLeft: Math.ceil((new Date(tech.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) }))
    };
  }, [technologies]);

  // Получить технологию по ID
  const getTechnologyById = useCallback((id) => {
    return technologies.find(tech => tech.id === id);
  }, [technologies]);

  // Добавить новую технологию
  const addTechnology = useCallback((newTech) => {
    const newId = Math.max(...technologies.map(t => t.id), 0) + 1;
    const newTechnology = {
      id: newId,
      title: newTech.title || 'Новая технология',
      description: newTech.description || '',
      status: 'not-started',
      notes: '',
      category: newTech.category || 'general',
      links: newTech.links || [],
      dueDate: newTech.dueDate || '',
      createdAt: new Date().toISOString(),
      roadmap: activeRoadmap
    };
    
    setTechnologies(prev => [...prev, newTechnology]);
    return newId;
  }, [technologies, activeRoadmap, setTechnologies]);

  // Удалить технологию
  const removeTechnology = useCallback((techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
  }, [setTechnologies]);

  // Экспорт данных в формат для загрузки
  const exportData = useCallback(() => {
    const roadmapTitle = activeRoadmap?.title || 'Моя дорожная карта';
    const roadmapDescription = activeRoadmap?.description || 'Дорожная карта изучения технологий';
    
    const exportData = {
      title: roadmapTitle,
      description: roadmapDescription,
      author: activeRoadmap?.author || 'Пользователь',
      version: activeRoadmap?.version || '1.0',
      exportedAt: new Date().toISOString(),
      totalItems: technologies.length,
      items: technologies.map(tech => ({
        id: tech.id,
        title: tech.title,
        description: tech.description,
        status: tech.status,
        notes: tech.notes,
        category: tech.category || 'general',
        links: tech.links || [],
        dueDate: tech.dueDate || null,
        createdAt: tech.createdAt,
        updatedAt: tech.updatedAt
      }))
    };

  return exportData;
}, [technologies, activeRoadmap]);

  return {
    technologies,
    activeRoadmap,
    updateTechnology,
    toggleStatus,
    updateNotes,
    updateDueDate,
    addLink,
    removeLink,
    loadNewData,
    markAllAsCompleted,
    resetAllStatuses,
    randomNextTechnology,
    resetAllData,
    clearAllNotes,
    clearAllDueDates,
    getStatistics,
    getTechnologyById,
    addTechnology,
    removeTechnology,
    exportData
  };
}

export default useTechnologies;