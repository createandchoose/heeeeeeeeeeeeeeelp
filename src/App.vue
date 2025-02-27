<template>
  <div id="app">
    <div v-if="!isAuthenticated">
      <h2>Авторизация через Telegram</h2>
      <p>Загрузка...</p>
    </div>
    <RouterView v-else />
  </div>
</template>

<script>
import axios from 'axios';
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false,
      profile: {
        first_name: '',
        last_name: '',
        username: '',
        photo_url: '',
        points: 0,
        coins: 0,
        role: ''
      }
    };
  },
  mounted() {
    this.initTelegram();
  },
  methods: {
    // Загрузка профиля из localStorage
    loadProfileFromStorage() {
      const savedProfile = localStorage.getItem('telegramProfile');
      if (savedProfile) {
        this.profile = JSON.parse(savedProfile);
        this.isAuthenticated = true;
        console.log('Загружен профиль из localStorage:', this.profile);
        return true;
      }
      return false;
    },

    // Сохранение профиля в localStorage
    saveProfileToStorage() {
      localStorage.setItem('telegramProfile', JSON.stringify(this.profile));
      console.log('Профиль сохранен в localStorage:', this.profile);
    },

    async initTelegram() {
      // Проверяем, есть ли сохраненные данные
      if (this.loadProfileFromStorage()) {
        return; // Если данные есть, авторизация не нужна
      }

      // Проверяем наличие объекта Telegram
      console.log('Проверка Telegram.WebApp:', window.Telegram);
      if (!window.Telegram || !window.Telegram.WebApp) {
        console.error('Telegram.WebApp не найден');
        alert('Telegram WebApp не инициализирован. Убедитесь, что вы запустили приложение через Telegram.');
        return;
      }

      const Telegram = window.Telegram.WebApp;
      console.log('Telegram WebApp объект:', Telegram);

      Telegram.ready();
      const initData = Telegram.initData;
      console.log('Получено initData:', initData);

      if (!initData) {
        console.error('initData пустое');
        alert('initData отсутствует. Проверьте, запущено ли приложение через Telegram WebApp.');
        return;
      }

      try {
        console.log('Отправка POST запроса с initData:', initData);
        const response = await axios.post('https://b8stify.ru/auth/telegram', {
          initData: initData
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Ответ от сервера:', response.data);

        if (!response.data.profile) {
          throw new Error('Сервер не вернул профиль пользователя');
        }

        // Заполняем профиль данными от сервера
        this.profile = {
          first_name: response.data.profile.first_name || '',
          last_name: response.data.profile.last_name || '',
          username: response.data.profile.username || '',
          photo_url: response.data.profile.photo_url || 'https://www.gravatar.com/avatar',
          points: response.data.profile.points || 0,
          coins: response.data.profile.coins || 0,
          role: response.data.profile.role || ''
        };

        // Сохраняем профиль в localStorage
        this.saveProfileToStorage();

        this.isAuthenticated = true;
        Telegram.expand();
      } catch (error) {
        console.error('Ошибка при запросе к серверу:', error.response ? error.response.data : error.message);
        alert(`Ошибка авторизации: ${error.message}`);
      }
    }
  }
};
</script>