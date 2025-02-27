<template>
  <div class="continer">
    <div class="zag">Таски</div>

    <!-- Tabs -->
    <div class="tabs-menu w-tab-menu">
      <a v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" data-w-tab="Tab 1"
        class="tabbb11c w-inline-block w-tab-link" :class="currentTab === tab.id ? 'w--current' : ''">
        <img src="" width="24"
          height="24">
        <div class="text-20">{{ tab.name }}</div>
      </a>
    </div>

    <div v-if="currentTab === 'tasks'" class="space-y-4">

      <div v-for="task in tasks" :key="task.id" class="frame-44727">

        <div class="componentstatus-3">
          <div class="pending-3">{{ task.status }}</div>
        </div>
        <div class="text-21">{{ task.title }}</div>
        <div class="text-22">{{ task.description }}</div>
        <div class="frame-2178">
          <div class="frame-2175">
            <div class="text-23">Награда:</div>
            <div class="frame-2179">
              <div class="text-24">⚡ {{ task.rewards.points }} Баллов</div>
              <div class="text-25">|</div>
              <img
                src=""
                loading="lazy" width="18" height="18" alt="" class="frame-44728">
              <div class="text-24">{{ task.rewards.boost }} BOOST</div>
            </div>
          </div>
          <div class="frame-2175">
            <div class="text-23">Сроки:</div>
            <div class="text-22">{{ task.deadline }}</div>
          </div>
        </div>
        <div class="frame-44729">
          <div class="frame-65">
            <div class="component-9 elements">
              <img
                src=""
                loading="lazy" width="24" height="24" alt="" class="file-filled">
              <div class="label-style">
                {{ task.status === 'В процессе' ? 'Отправить на проверку' : 'На проверке' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchTasks } from '/api';  // Импортируем метод для получения задач

const currentTab = ref('tasks');
const tasks = ref([]);

const tabs = [
  { id: 'tasks', name: 'Задачи' },
  { id: 'notifications', name: 'Уведомления' }
];

// Загружаем задачи при монтировании компонента
onMounted(async () => {
  try {
    tasks.value = await fetchTasks();
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error);
  }
});
</script>