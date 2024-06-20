<template>
  <div
    v-if="accumulatedCalculations && accumulatedCalculations.totalGmvLoss !== 0"
    :class="variablesStore.isNegative ? 'result-bad' : 'result-good'"

  >
    <div v-if="accumulatedCalculations && accumulatedCalculations.totalGmvLoss !== 0">
      <div class="lines">
        <h3 :class="variablesStore.isNegative ? 'red' : 'green'">
          Estimated GMV Impact:
          {{ numberWithCommas(Math.round(accumulatedCalculations.totalGmvLoss)) }}€
        </h3>
        <p>
          (Range: {{ numberWithCommas(Math.round(accumulatedCalculations.totalRangeFrom)) }}€ to
          {{ numberWithCommas(Math.round(accumulatedCalculations.totalRangeTo)) }}€)
        </p>
        <p>
          Based on <b>{{ numberDays }}</b> similar days
        </p>
        <div>
        <PreCalculation></PreCalculation>
      </div>
        <p
          :class="variablesStore.isNegative ? 'based-bad' : 'based'"
          v-if="!showDetails"
          @click="toggleDetails"
        >
          click here for more info
        </p>
        <p
          :class="variablesStore.isNegative ? 'based-bad' : 'based'"
          v-if="showDetails"
          @click="toggleDetails"
        >
          click again to close
        </p>
        <transition name="unfold">
          <div v-if="showDetails" class="detail-text">
            <p>
              The calculation examines the average hourly GMV from corresponding weekdays
              over the past 28 days, excluding holidays. The loss/gain is calculated by deducting
              that average (or expected) value in the selected hours, from the actual generated GMV.
            </p>
            <p>
              The calculation of range (max, min) substitutes deducting the average to deducting by
              the most or least profitable hours respectively
            </p>
            <p>
              <b>Simple:</b> Compares the absolute differences in euros.
              <p></p>
              <b>Normalized:</b> Compares proportions: "what % of total GMV was supposed to be generated at 15:00?". Usually yields a more narow min-max spread. Since this calculation relies on selection, the bars will change slightly as they are being clicked.
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useVariablesStore } from '@/stores/PostMortem/variables'
import PreCalculation from "../PostMortemTool/PreCalculation.vue"
const variablesStore = useVariablesStore()
const isNegative = ref(false)
const showDetails = ref(false) 
const totalGmvLoss = ref(0)

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// computed property to accumulate the values
const numberDays = computed(() => {
  const { processedData } = variablesStore
  if (!processedData) {
    console.log('no day processedData')
  }
  return processedData.days_accounted[1]
})

const accumulatedCalculations = computed(() => {
  const { processedData, offtime, ontime } = variablesStore
  if (
    !processedData ||
    !Array.isArray(processedData.hours) ||
    !Array.isArray(processedData.on_h_gmv) ||
    !Array.isArray(processedData.off_havg_gmv) ||
    !Array.isArray(processedData.off_hmax_gmv) ||
    !Array.isArray(processedData.off_hmin_gmv)
  ) {
    console.error('Data structure is invalid or missing arrays:', processedData)
    return { totalGmvLoss: 0, totalRangeTo: 0, totalRangeFrom: 0 }
  }

  let totalGmvLoss = 0,
    totalRangeTo = 0,
    totalRangeFrom = 0
    for (let i = 0; i < processedData.hours.length; i++) {
    if (variablesStore.offtimes.includes(processedData.hours[i])) { // Check if the current hour is in offtimes
       if (variablesStore.model === 'normalized') {
      totalGmvLoss -= processedData.avg_norm_loss[i]
      totalRangeTo -= processedData.max_norm_loss[i]
      totalRangeFrom -= processedData.min_norm_loss[i]
       }
       else if (variablesStore.model ==='simple') {
      totalGmvLoss -= processedData.avg_flat_loss[i]
      totalRangeTo -= processedData.max_flat_loss[i]
      totalRangeFrom -= processedData.min_flat_loss[i]
       }
    }
  }





  //off 5
  //on 10 
  //
  // console.log({ totalGmvLoss, totalRangeTo, totalRangeFrom }) // Debug output
  return { totalGmvLoss, totalRangeTo, totalRangeFrom }
})

watch(accumulatedCalculations, (newValue) => {
  variablesStore.setNegative(newValue.totalGmvLoss < 0)
  console.log("loss at calculation is:", newValue.totalGmvLoss)
  variablesStore.setLoss(newValue.totalGmvLoss)
})

function toggleDetails() {
  showDetails.value = !showDetails.value
};

</script>

<style>

.result-bad {
  font-size: MAX(0.6vw, 0.6rem);
  background-color: rgb(255, 253, 253);
  margin-top: 2rem;
  scale: 1;
  margin-left: 2.5rem;
  border: 3.5px solid rgba(255, 0, 0, 0.25);
  border-radius: 0.5rem;
  box-shadow: 0 0px 12px rgba(255, 0, 0, 0.25);
  -webkit-user-select: none; 
  -ms-user-select: none; 
  user-select: none; 
}

.result-good {
  font-size: MAX(0.6vw, 0.6rem);
  background-color: rgb(253, 255, 253);
  margin-top: 2rem;
  scale: 1;
  margin-left: 2.5rem;
  border: 3.5px solid rgba(9, 172, 9, 0.25);
  border-radius: 0.5rem;
  box-shadow: 0 0px 12px rgba(9, 172, 9, 0.25);
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
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

.lines h3,
.lines p {
  margin: 0;
  padding: 0.1rem 0;
  line-height: 1.2;
}

.detail-text {
  color: gray;
  font-size: MAX(0.6vw, 0.6rem);
}

.based,
.based-bad {
  color: #ccc;
  opacity: 1;
}

.based-bad:hover {
  cursor: pointer;
  color: #ff0000;
  opacity: 1;
}
.based:hover {
  cursor: pointer;
  color: rgb(9, 172, 9);
  opacity: 1;
}


.unfold-enter-from,
.unfold-leave-to {
  transform: scaleY(0);
  transform-origin: top;
  height: 0;
  opacity: 0;
}


.unfold-enter-to,
.unfold-leave-from {
  transform: scaleY(1);
  transform-origin: top;
  height: auto; 
  opacity: 1;
}


.unfold-enter-active,
.unfold-leave-active {
  transition:
    transform 0.1s ease,
    opacity 0.1s ease,
    height 0.5s ease;
}
</style>
