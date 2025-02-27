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
    </div>
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
        photo_url: ''
      }
    };
  },
  mounted() {
    this.initTelegram();
  },
  methods: {
    async initTelegram() {
      const Telegram = window.Telegram.WebApp;
      Telegram.ready();

      const initData = Telegram.initData;

      if (initData) {
        try {
          const response = await axios.post('https://b8stify.ru/auth/telegram', {
            initData: initData
          });
          
          this.profile = response.data.profile;
          this.isAuthenticated = true;
          Telegram.expand(); // Разворачиваем приложение
        } catch (error) {
          console.error('Ошибка авторизации:', error);
          alert('Не удалось авторизоваться');
        }
      } else {
        alert('Запустите приложение через Telegram');
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}
</style>

<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style> -->
