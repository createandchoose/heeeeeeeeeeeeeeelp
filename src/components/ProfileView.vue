<template>
    <div class="container">
      <div class="zag">Мой профиль</div>
  
      <div v-if="!isAuthenticated">
        <h2>Авторизация через Telegram</h2>
        <p>Загрузка...</p>
      </div>
      <span v-else>
        <div class="frame-447">
          <div class="frame-68">
            <div class="imgprof">
              <img :src="profile.photo_url" loading="lazy" alt="Профиль" />
            </div>
            <div class="content-style">
              <div class="component elements">
                <div class="text">{{ profile.first_name }} {{ profile.last_name }}</div>
                <div class="text-2">Сотрудник {{ profile.role }}</div>
              </div>
            </div>
          </div>
          <div class="component-2 elements">
            <div class="frame-1114">
              <div class="text-3">Ур. {{ level }}</div>
            </div>
            <div class="text-4">Рейтинг #8</div>
          </div>
        </div>
  
        <div class="bcoin">
          <div class="frame-2169">
            <div class="frame-2170">
              <div class="text-16">Текущий баланс</div>
            </div>
            <div class="frame-2171">
              <img :src="profile.photo_url" loading="lazy" width="24" height="24" alt="" class="frame-2172" />
              <div class="text-17">{{ profile.coins }},00</div>
            </div>
            <a href="#" target="_blank" class="button-style fill">
              <div class="text-18">BOOST Коины</div>
            </a>
          </div>
        </div>
  
        <div class="frame-447-1">
          <div class="text">Баллы</div>
          <div class="ballbars">
            <div class="znachns"></div>
          </div>
          <div class="div-block">
            <div class="texttt1">{{ profile.points }} из 100</div>
            <div class="div-block-2">
              <div class="texttt1">Еще {{ pointsToNextLevel }} до</div>
              <div class="frame-1114">
                <div class="text-3">Ур. {{ nextLevel }}</div>
              </div>
            </div>
          </div>
          <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
        </div>
  
        <!-- Остальная часть вашего шаблона -->
      </span>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  const isAuthenticated = ref(false);
  const profile = ref({
    points: 0, // Изначально 0, замените на актуальное значение
    first_name: '',
    last_name: '',
    role: '',
    photo_url: '',
    coins: 0,
  });
  
  // Функция для инициализации Telegram Web App
  const initTelegram = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
  
      // Получаем данные профиля
      profile.value = tg.initDataUnsafe.user;
      isAuthenticated.value = true;
  
      // Выводим информацию о пользователе в консоль
      console.log('Профиль пользователя:', profile.value);
    } else {
      console.error('Telegram.WebApp не найден');
    }
  };
  
  // Вычисляем уровень
  const level = computed(() => {
    return Math.floor(profile.value.points / 100) + 1;
  });
  
  // Вычисляем следующий уровень
  const nextLevel = computed(() => {
    return level.value + 1;
  });
  
  // Вычисляем, сколько очков осталось до следующего уровня
  const pointsToNextLevel = computed(() => {
    return 100 - (profile.value.points % 100);
  });
  
  // Вычисляем ширину прогресс-бара
  const progressBarWidth = computed(() => {
    const progress = (profile.value.points % 100) / 100 * 100;
    return `${progress}%`;
  });
  
  // Инициализация при монтировании компонента
  onMounted(() => {
    initTelegram();
  });
  </script>
  
  <style scoped>
  .progress-bar {
    height: 20px;
    background-color: green;
    transition: width 0.3s;
  }
  </style>