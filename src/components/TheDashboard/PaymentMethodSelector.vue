<template>
    <div>
      <label for="paymentMethodSelect">Select Payment Method:</label>
      <select id="paymentMethodSelect" v-model="selectedPaymentMethod" @change="updatePaymentMethod">
        <option value="">All</option>
        <option v-for="method in paymentMethods" :key="method" :value="method">
          {{ method }}
        </option>
      </select>
    </div>
  </template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useDashboardStore } from '@/stores/TheDashboard/data.js';

const store = useDashboardStore();

const selectedPaymentMethod = computed({
  get: () => store.selectedPaymentMethod,
  set: value => store.setSelectedPaymentMethod(value)
});

const paymentMethods = ref([]);

// Assuming your payment methods can be derived from hm_live data
watch(() => store.hm_live.payment_provider_method, (newMethods) => {
  paymentMethods.value = [...new Set(newMethods)];
}, { immediate: true });

function updatePaymentMethod() {
  // This will trigger reactivity in other components watching the store's selectedPaymentMethod
  store.setSelectedPaymentMethod(selectedPaymentMethod.value);
}
</script>