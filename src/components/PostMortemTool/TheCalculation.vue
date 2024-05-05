<template>
  <div v-if="accumulatedCalculations && accumulatedCalculations.totalGmvLoss !== 0" class="result">
    <div v-if="accumulatedCalculations && accumulatedCalculations.totalGmvLoss !== 0">
      <div class="lines">
        <h3 :class="variablesStore.isNegative ? 'red' : 'green'">
          Estimated GMV Impact: {{ numberWithCommas(Math.round(accumulatedCalculations.totalGmvLoss)) }}€
        </h3>
        <p>
          (Range: {{ numberWithCommas(Math.round(accumulatedCalculations.totalRangeFrom)) }}€ to
          {{ numberWithCommas(Math.round(accumulatedCalculations.totalRangeTo)) }}€)
        </p>
        <p @click="toggleDetails" class="based">Based on <b>{{ numberDays }}</b> similar days*</p>
        <div v-if="showDetails" class="detail-text">
          <p>The calculation examines the normalized average hourly GMV from corresponding weekdays over the past 28 days, excluding holidays. The loss/gain is calculated by deducting that average in the selected hours, from the actual generated GMV.</p>
          <p>The calculation of range (max, min) substitutes deducting the average to deducting by the most or least profitable hours respectively</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 
const variablesStore = useVariablesStore();
const isNegative = ref(false);
const showDetails = ref(false); // Reactive variable to control visibility of additional details

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Computed property to accumulate the values
const numberDays = computed(() => {
  const {data}  = variablesStore; 
   if (!data) {
    console.log("no day data")
   }
   return data.days[1]
})

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
      totalGmvLoss -=  data.avg_loss[i];
      totalRangeTo -= data.max_loss[i];
      totalRangeFrom -= data.min_loss[i];
    }
  }
  console.log({ totalGmvLoss, totalRangeTo, totalRangeFrom }); // Debug output
  return { totalGmvLoss, totalRangeTo, totalRangeFrom };
});

watch(accumulatedCalculations, (newValue) => {
  variablesStore.setNegative(newValue.totalGmvLoss < 0);
});

function toggleDetails() {
  showDetails.value = !showDetails.value;
}

</script>
  
  
  
  <style>
.result {
    margin-top: 5rem;
    width: 25rem;
    margin-left: 2.5rem;
    border: 1px black solid;
}

.lines {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem; 
}

.red {
    color: red;
}

.green {
    color: green;
}

.lines h3, .lines p {
    margin: 0; 
    padding: 0.2rem 0;
    line-height: 1.2; 
}


.detail-text {
    color: gray;       
    font-size: 0.9rem;  
}

.based:hover {
  cursor: pointer;
}
  </style>
  