<template>
<div class="continer">
        <div class="zag">Мой профиль</div>

        <div v-if="!isAuthenticated">
            <h2>Авторизация через Telegram</h2>
            <p>Загрузка...</p>
        </div>
        <span v-else>
        <div class="frame-447">
            <div class="frame-68">
                <div class="imgprof"><img :src="profile.photo_url" loading="lazy" alt=""></div>
                <div class="content-style">
                    <div class="component elements">
                        <div class="text">{{ profile.first_name }} {{ profile.last_name }}</div>
                        <div class="text-2">Сотрудник{{ profile.role }}</div>
                    </div>
                </div>
            </div>
            <div class="component-2 elements">
                <div class="frame-1114">
                    <div class="text-3">Ур. {{ currentLevel }}</div>
                </div>
                <div class="text-4">Рейтинг #1</div>
            </div>
        </div>

        <!-- <p><strong>Очки:</strong> {{ profile.points }}</p>
      <p><strong>Уровень:</strong> {{ currentLevel }}</p>
      <p><strong>Следующий уровень:</strong> {{ nextLevel }}</p>
      <p><strong>Осталось до следующего уровня:</strong> {{ pointsToNextLevel }} очков</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div></div> -->


        <div class="bcoin">
            <div class="frame-2169">
                <div class="frame-2170">
                    <div class="text-16">Текущий баланс</div>
                </div>
                <div class="frame-2171"><img src="" loading="lazy" width="24" height="24" alt="" class="frame-2172">
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
                <div class="znachns" :style="{ width: pointsMod100 + '%' }"></div>
            </div>
            <div class="div-block">
                <div class="texttt1">{{ pointsMod100 }} из 100</div>
                <div class="div-block-2">
                    <div class="texttt1">Еще {{ pointsNeededTo100 }} до</div>
                    <div class="frame-1114">
                        <div class="text-3">Ур. {{ nextLevel }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-style icon">
            <div class="frame-35">
                <a href="#" target="_blank" class="button-style-2 icon">
                    <div class="emoji basketball"><img src="" loading="lazy" width="36" height="36" alt="" class="basketball"></div>
                </a>
                <div class="component-4 elements">
                    <div class="text-15">Достжения</div>
                    <div class="text-11">Получено: 34</div>
                </div>
            </div>
            <div class="frame-35">
                <a href="#" target="_blank" class="button-style-3 icon">
                    <div class="emoji-2 boxing-glove"><img src="" loading="lazy" width="37.125" height="36" alt="" class="basketball"></div>
                </a>
                <div class="component-5 elements">
                    <div class="text-15">Сделано</div>
                    <div class="text-11">Тасков: 34</div>
                </div>
            </div>
            <div class="frame-35">
                <a href="#" target="_blank" class="button-style-4 icon">
                    <div class="emoji sparkles"><img src="" loading="lazy" width="37.125" height="36" alt="" class="basketball"></div>
                </a>
                <div class="component-6 elements">
                    <div class="text-15">Награды</div>
                    <div class="text-11">Всего: 4</div>
                </div>
            </div>
        </div>
        <div class="frame-2212">
            <div class="frame-44756">
                <div class="frame-44757">
                    <div class="text">Достижения</div>
                </div>
                <div class="section-style-6 icon">
                    <div class="frame-44758">
                        <a href="#" target="_blank" class="button-style-6 icon"><img src="" loading="lazy" width="50" height="50" alt="" class="basketball-2"></a>
                    </div>
                    <div class="frame-44758">
                        <a href="#" target="_blank" class="button-style-6 icon"><img src="" loading="lazy" width="50" height="50" alt="" class="basketball-2"></a>
                    </div>
                    <div class="frame-44758">
                        <a href="#" target="_blank" class="button-style-6 icon"><img src="" loading="lazy" width="50" height="50" alt="" class="basketball-2"></a>
                    </div>
                    <div class="frame-41">
                        <div class="text-48">+1</div>
                    </div>
                </div>
            </div>
            <div class="frame-44759">
                <div class="component-17 elements">
                    <div class="text-49">Перейти к достижениям</div>
                </div>
            </div>
            <div class="frame-44756">
                <div class="frame-44757">
                    <div class="text">Награда</div>
                </div>
            </div>
            <div class="qwrqwr">
                <div class="frame-44762"><img src="" loading="lazy" width="50" height="50" alt="" class="basketball-3">
                    <div class="text-50">Сертификат отличия</div>
                    <div class="text-51">02.03.2025</div>
                </div>
                <div class="frame-44762"><img src="" loading="lazy" width="50" height="50" alt="" class="basketball-3">
                    <div class="text-50">Знак почета</div>
                    <div class="text-51">12.12.2024</div>
                </div>
                <div class="frame-44762"><img src="" loading="lazy" width="50" height="50" alt="" class="basketball-3">
                    <div class="text-50">Знак почета</div>
                    <div class="text-51">12.12.2024</div>
                </div>
            </div>
        </div>
    </span>
    </div>


</template>

<script setup>
import { ref, computed, inject } from 'vue';

// Получаем данные из App.vue через inject
const { profile, isAuthenticated } = inject('authData', { profile: ref({ points: 0 }), isAuthenticated: ref(false) });

// Computed свойства для уровней и прогресса
const currentLevel = computed(() => 1 + Math.floor(profile.value.points / 100));
const nextLevel = computed(() => currentLevel.value + 1);
const pointsMod100 = computed(() => profile.value.points % 100); // Остаток от 100
const pointsLeftTo100 = computed(() => pointsMod100.value); // Сколько накоплено в текущей сотне
const pointsNeededTo100 = computed(() => 100 - pointsMod100.value); // Сколько нужно до 100
</script>


<!-- <script setup>
import { ref, onMounted } from 'vue';

const isAuthenticated = ref(false);
const profile = ref({});

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

// Инициализация при монтировании компонента
onMounted(() => {
  initTelegram();
});
</script> -->