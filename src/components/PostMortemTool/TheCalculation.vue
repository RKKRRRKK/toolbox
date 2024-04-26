<template>
    <div class="result">
        <div v-if="accumulatedCalculations && accumulatedCalculations.totalGmvLoss !== 0">
        <div>
          Estimated GMV Loss: {{ Math.round(accumulatedCalculations.totalGmvLoss) }}
          (Range: {{ Math.round(accumulatedCalculations.totalRangeFrom) }} to {{ Math.round(accumulatedCalculations.totalRangeTo) }}) 
          Based on IQR
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { computed } from 'vue';
  import { useVariablesStore } from '@/stores/PostMortem/variables'; 
  const variablesStore = useVariablesStore();
  
  // Computed property to accumulate the values
  const accumulatedCalculations = computed(() => {
  const { data, offtime, ontime } = variablesStore;
  if (!data || !Array.isArray(data.hours) || !Array.isArray(data.actual_gmv) ||
      !Array.isArray(data.average_gmv) || !Array.isArray(data.Q3) || !Array.isArray(data.Q1)) {
    console.error('Data structure is invalid or missing arrays:', data);
    return { totalGmvLoss: 0, totalRangeTo: 0, totalRangeFrom: 0 };
  }
  
  let totalGmvLoss = 0, totalRangeTo = 0, totalRangeFrom = 0;
  for (let i = 0; i < data.hours.length; i++) {
    if (data.hours[i] >= offtime && data.hours[i] <= ontime) {
      totalGmvLoss += (data.actual_gmv[i] - data.average_gmv[i]);
      totalRangeTo += (data.actual_gmv[i] - data.Q3[i]);
      totalRangeFrom += (data.actual_gmv[i] - data.Q1[i]);
    }
  }
  console.log({ totalGmvLoss, totalRangeTo, totalRangeFrom }); // Debug output
  return { totalGmvLoss, totalRangeTo, totalRangeFrom };
});
  </script>
  
  
  
  
  <style>
  .result {
      margin-top: 5rem;
      width: 25rem;
      margin-left: 2.5rem;
      border: 1px black solid;
  }
  </style>
  