<template>
    <div>
      <label for="dateselect">Select Date:</label>
      <select id="dateselect" v-model="selectedDate" @change="updateDate">
        <option value="">All</option>
        <option v-for="date in dates" :key="date" :value="date">
          {{ date }}
        </option>
      </select>
    </div>
  </template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useDashboardStore } from '@/stores/TheDashboard/data.js';

const store = useDashboardStore();

const selectedDate = computed({
  get: () => store.selectedDate,
  set: value => store.setSelectedDate(value)
});

const dates = ref([]);

// Assuming your payment methods can be derived from hm_live data
watch(() => store.hm_live.date, (newDate) => {
  dates.value = [...new Set(newDate)];
}, { immediate: true });

function updateDate() {
  // This will trigger reactivity in other components watching the store's selectedPaymentMethod
  store.setSelectedDate(selectedDate.value);
}
</script>