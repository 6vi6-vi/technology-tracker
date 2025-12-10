import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение базовых компонентов React и их жизненного цикла', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX и его отличий от HTML', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов и хуками', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 4, 
    title: 'React Router', 
    description: 'Настройка маршрутизации в React приложении', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 5, 
    title: 'Node.js Basics', 
    description: 'Основы серверного JavaScript', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  { 
    id: 6, 
    title: 'Express Framework', 
    description: 'Создание REST API с помощью Express', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  { 
    id: 7, 
    title: 'Database Integration', 
    description: 'Подключение и работа с базами данных', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  { 
    id: 8, 
    title: 'Authentication', 
    description: 'Реализация систем аутентификации', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  { 
    id: 9, 
    title: 'Deployment', 
    description: 'Деплой приложений на сервер', 
    status: 'not-started',
    notes: '',
    category: 'devops'
  },
  { 
    id: 10, 
    title: 'Testing', 
    description: 'Написание тестов для приложений', 
    status: 'not-started',
    notes: '',
    category: 'quality'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Функция для циклического изменения статуса
  const toggleStatus = (techId) => {
    setTechnologies(prev => 
      prev.map(tech => {
        if (tech.id === techId) {
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  // Функция для обновления заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция для отметки всех как выполненных
  const markAllAsCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Функция для случайного выбора следующей технологии
  const randomNextTechnology = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTech.length > 0) {
      const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
      const randomId = randomTech.id;
      
      setTechnologies(prev => 
        prev.map(tech => 
          tech.id === randomId ? { ...tech, status: 'in-progress' } : tech
        )
      );
      
      return randomId;
    }
    return null;
  };

  // Функция для расчета общего прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // Функция для получения статистики
  const getStatistics = () => {
    const totalCount = technologies.length;
    const completedCount = technologies.filter(tech => tech.status === 'completed').length;
    const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
    
    // Статистика по категориям
    const categories = {};
    technologies.forEach(tech => {
      if (!categories[tech.category]) {
        categories[tech.category] = { total: 0, completed: 0 };
      }
      categories[tech.category].total++;
      if (tech.status === 'completed') {
        categories[tech.category].completed++;
      }
    });

    return {
      totalCount,
      completedCount,
      inProgressCount,
      notStartedCount,
      categories,
      progress: calculateProgress()
    };
  };

  // Функция для сброса всех данных
  const resetAllData = () => {
    setTechnologies(initialTechnologies);
  };

  return {
    technologies,
    toggleStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    randomNextTechnology,
    resetAllData,
    getStatistics
  };
}

export default useTechnologies;