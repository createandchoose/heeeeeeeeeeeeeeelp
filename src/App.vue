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
import { reactive, provide, watch } from 'vue';
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const state = reactive({
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
    });

    // Функция для загрузки данных из localStorage
    const loadProfileFromStorage = () => {
      const savedProfile = localStorage.getItem('telegramProfile');
      if (savedProfile) {
        Object.assign(state.profile, JSON.parse(savedProfile));
        state.isAuthenticated = true;
      }
    };

    // Сохранение профиля в localStorage при изменении
    watch(state.profile, (newProfile) => {
      if (state.isAuthenticated) {
        localStorage.setItem('telegramProfile', JSON.stringify(newProfile));
      }
    }, { deep: true });

    // Авторизация через Telegram
    const initTelegram = async () => {
      if (state.isAuthenticated) return;
      
      if (!window.Telegram || !window.Telegram.WebApp) {
        console.error('Telegram.WebApp не найден');
        return;
      }

      const Telegram = window.Telegram.WebApp;
      Telegram.ready();
      const initData = Telegram.initData;

      if (!initData) {
        console.error('initData пустое');
        return;
      }

      try {
        const response = await axios.post('https://b8stify.ru/auth/telegram', { initData });
        if (!response.data.profile) throw new Error('Сервер не вернул профиль');

        Object.assign(state.profile, response.data.profile);
        state.isAuthenticated = true;
      } catch (error) {
        console.error('Ошибка авторизации:', error);
      }
    };

    loadProfileFromStorage();
    initTelegram();

    // Предоставляем данные в inject
    provide('authData', state);

    return state;
  },
  components: {
    RouterView
  }
};
</script>
