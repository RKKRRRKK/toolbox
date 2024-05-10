<template>
  <div v-if="accumulatedCalculations && accumulatedCalculations.totalGmvLoss !== 0" :class="variablesStore.isNegative ? 'result-bad' : 'result-good'">
    <div v-if="accumulatedCalculations && accumulatedCalculations.totalGmvLoss !== 0">
      <div class="lines">
        <h3 :class="variablesStore.isNegative ? 'red' : 'green'">
          Estimated GMV Impact: {{ numberWithCommas(Math.round(accumulatedCalculations.totalGmvLoss)) }}€
        </h3>
        <p>
          (Range: {{ numberWithCommas(Math.round(accumulatedCalculations.totalRangeFrom)) }}€ to
          {{ numberWithCommas(Math.round(accumulatedCalculations.totalRangeTo)) }}€)
        </p>
        <p >Based on <b>{{ numberDays }}</b> similar days</p>
        <p :class="variablesStore.isNegative ? 'based-bad' : 'based'" v-if="!showDetails" @click="toggleDetails">click here for more info</p>
        <p :class="variablesStore.isNegative ? 'based-bad' : 'based'" v-if="showDetails" @click="toggleDetails">click again to close</p>
        <transition name="unfold">
        <div v-if="showDetails" class="detail-text">
          <p>The calculation examines the normalized average hourly GMV from corresponding weekdays over the past 28 days, excluding holidays. The loss/gain is calculated by deducting that average in the selected hours, from the actual generated GMV.</p>
          <p>The calculation of range (max, min) substitutes deducting the average to deducting by the most or least profitable hours respectively</p>
          <p><b>Normalization:</b> instead of looking at the absolute numbers in euros, we are looking at the trend line; "what % of total GMV was generated at 3pm". This percentage is then multiplied by the GMV total during the outtage day.</p>
        </div>
      </transition>
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
.result-bad {
   background-color: rgb(255, 253, 253);
    margin-top: 2rem;
    width: 25rem;
    margin-left: 2.5rem;
    border: 3.5px solid rgba(255, 0, 0, 0.25); 
    border-radius: 0.5rem;
    box-shadow: 0 0px 12px rgba(255, 0, 0, 0.25); 
}

.result-good {
   background-color:rgb(253, 255, 253);
    margin-top: 2rem;
    width: 25rem;
    margin-left: 2.5rem;
    border: 3.5px solid  rgba(9, 172, 9, 0.25);
    border-radius: 0.5rem;
    box-shadow: 0 0px 12px rgba(9, 172, 9, 0.25); 
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
    color: rgb(9, 172, 9);
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

.based, .based-bad {
  color: #ccc;
  opacity: 1
  
}

.based-bad:hover {
  cursor: pointer;
  color: #FF0000;
  opacity: 1
}
.based:hover {
  cursor: pointer;
  color: rgb(9, 172, 9);
  opacity: 1
}

/* Initial state of the entering element */
.unfold-enter-from, .unfold-leave-to {
  transform: scaleY(0);
  transform-origin: top;
  height: 0;
  opacity: 0;
}

/* Target state of the entering element */
.unfold-enter-to, .unfold-leave-from {
  transform: scaleY(1);
  transform-origin: top;
  height: auto; /* Adjust this based on the content size or leave as 'auto' */
  opacity: 1;
}

/* Active state of the animation */
.unfold-enter-active, .unfold-leave-active {
  transition: transform 0.1s ease, opacity 0.1s ease, height 0.5s ease;
}


  </style>
  