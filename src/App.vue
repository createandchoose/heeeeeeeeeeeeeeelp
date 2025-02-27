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
      const Telegram = window.Telegram?.WebApp;
      if (!Telegram) {
        console.error('Telegram WebApp не найден. Запустите приложение через Telegram.');
        alert('Запустите приложение через Telegram');
        return;
      }

      Telegram.ready();
      const initData = Telegram.initData;
      console.log('Получено initData:', initData);

      if (!initData) {
        console.error('initData отсутствует');
        alert('Запустите приложение через Telegram');
        return;
      }

      try {
        console.log('Отправка POST запроса на сервер...');
        const response = await axios.post('https://b8stify.ru/auth/telegram', {
          initData: initData
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Ответ от сервера:', response.data);

        // Проверяем, что сервер вернул ожидаемые данные
        if (!response.data.profile || !response.data.token) {
          throw new Error('Неверный формат ответа сервера');
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
        console.error('Ошибка авторизации:', error.response ? error.response.data : error.message);
        alert(`Не удалось авторизоваться: ${error.message}`);
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