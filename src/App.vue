<template>
  <div id="app">
    <div v-if="!isAuthenticated">
      <h2>Авторизация через Telegram</h2>
      <p>Загрузка...</p>
    </div>
    <div v-else>
      <h2>Профиль пользователя</h2>
      <img :src="profile.photo_url" alt="Avatar" class="avatar" />
      <p><strong>Имя:</strong> {{ profile.first_name }}</p>
      <p><strong>Фамилия:</strong> {{ profile.last_name }}</p>
      <p><strong>Username:</strong> {{ profile.username }}</p>
      <p><strong>Очки:</strong> {{ profile.points }}</p>
      <p><strong>Монеты:</strong> {{ profile.coins }}</p>
      <p><strong>Роль:</strong> {{ profile.role }}</p>
    </div>
    <RouterView />
  </div>
</template>

<script>
import axios from 'axios';

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
    async initTelegram() {
      // Проверяем наличие объекта Telegram
      console.log('Проверка Telegram.WebApp:', window.Telegram);
      if (!window.Telegram || !window.Telegram.WebApp) {
        console.error('Telegram.WebApp не найден');
        alert('Telegram WebApp не инициализирован. Убедитесь, что вы запустили приложение через Telegram.');
        return;
      }

      const Telegram = window.Telegram.WebApp;
      console.log('Telegram WebApp объект:', Telegram);

      // Инициализация Telegram
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

        this.profile = {
          first_name: response.data.profile.first_name || '',
          last_name: response.data.profile.last_name || '',
          username: response.data.profile.username || '',
          photo_url: response.data.profile.photo_url || 'https://www.gravatar.com/avatar',
          points: response.data.profile.points || 0,
          coins: response.data.profile.coins || 0,
          role: response.data.profile.role || ''
        };
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

<script setup>
import { RouterView } from 'vue-router';
</script>

<style scoped>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>