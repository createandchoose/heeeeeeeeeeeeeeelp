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
    this.checkAuthentication();
  },
  methods: {
    // Проверка текущей авторизации
    async checkAuthentication() {
      if (this.loadProfileFromStorage()) {
        console.log('Авторизация подтверждена через localStorage.');
        this.isAuthenticated = true;
        this.startProfileUpdateCheck();
      } else {
        console.log('Авторизация отсутствует. Инициализируем Telegram...');
        await this.initTelegram();
      }
    },

    // Загрузка профиля из localStorage
    loadProfileFromStorage() {
      const savedProfile = localStorage.getItem('telegramProfile');
      if (savedProfile) {
        this.profile = JSON.parse(savedProfile);
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
      console.log('Проверка Telegram.WebApp:', window.Telegram);
      if (!window.Telegram || !window.Telegram.WebApp) {
        console.error('Telegram.WebApp не найден');
        alert('Telegram WebApp не инициализирован. Убедитесь, что вы запустили приложение через Telegram.');
        return;
      }

      const Telegram = window.Telegram.WebApp;
      Telegram.ready();
      const initData = Telegram.initData;

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

        this.updateProfile(response.data.profile);
        this.isAuthenticated = true;
        Telegram.expand();
        this.startProfileUpdateCheck();
      } catch (error) {
        console.error('Ошибка при запросе к серверу:', error.response ? error.response.data : error.message);
        alert(`Ошибка авторизации: ${error.message}`);
      }
    },

    async checkProfileUpdates() {
      if (!this.isAuthenticated) {
        console.warn('Попытка обновления профиля без авторизации.');
        return;
      }

      try {
        const response = await axios.get('https://b8stify.ru/profile', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.data.profile) {
          console.warn('Профиль не найден в ответе сервера');
          return;
        }

        const updatedProfile = response.data.profile;
        if (JSON.stringify(updatedProfile) !== JSON.stringify(this.profile)) {
          console.log('Обновление профиля:', updatedProfile);
          this.updateProfile(updatedProfile);
        }
      } catch (error) {
        console.error('Ошибка при обновлении профиля:', error.response ? error.response.data : error.message);
      }
    },

    updateProfile(newProfile) {
      this.profile = {
        first_name: newProfile.first_name || '',
        last_name: newProfile.last_name || '',
        username: newProfile.username || '',
        photo_url: newProfile.photo_url || 'https://www.gravatar.com/avatar',
        points: newProfile.points || 0,
        coins: newProfile.coins || 0,
        role: newProfile.role || ''
      };
      this.saveProfileToStorage();
    },

    startProfileUpdateCheck() {
      setInterval(this.checkProfileUpdates, 60000); // Проверка каждые 60 секунд
    }
  }
};
</script>
