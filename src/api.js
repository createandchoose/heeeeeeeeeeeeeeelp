import axios from 'axios';

// Базовый URL API (можно вынести в .env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://80.255.190.5:8000';

// Создаем экземпляр axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Метод для получения задач с преобразованием данных
export const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks');
    const tasks = response.data;
    // Преобразуем данные для фронтенда
    return tasks.map(task => ({
      id: task.id,
      title: task.description, // Используем description как title
      description: task.description,
      status: 'В процессе', // Статичное значение, можно доработать
      rewards: {
        points: task.points,
        boost: task.coins, // coins как boost
      },
      deadline: new Date(task.deadline).toLocaleString(), // Форматируем дату
    }));
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error.response?.data || error.message);
    throw error;
  }
};

// Метод для добавления задачи
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/create-task', taskData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании задачи:', error.response?.data || error.message);
    throw error;
  }
};

// Метод для получения продуктов
export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error.response?.data || error.message);
    throw error;
  }
};

// Метод для добавления продукта
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании продукта:', error.response?.data || error.message);
    throw error;
  }
};

// Метод для получения конкретного продукта по ID
export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке продукта:', error.response?.data || error.message);
    throw error;
  }
};

// Метод для покупки продукта
export const purchaseProduct = async (data) => {
  try {
    const response = await api.post('/purchase-product', data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при покупке продукта:', error.response?.data || error.message);
    throw error;
  }
};