<!-- <template>  didn't work. 
    <button></button>
  </template>
  
  <script setup>
  import { computed, watch, onMounted } from 'vue'
  import { useVariablesStore } from '@/stores/PostMortem/variables'
  
  const variablesStore = useVariablesStore()
  
  // Computed properties for fromIndex and toIndex
  const fromIndex = computed(() => variablesStore.offtime)
  const toIndex = computed(() => variablesStore.ontime)
  
  // Computed properties for actualgmv and averagegmv
  const actualgmv = computed(() => variablesStore.processedData.on_h_gmv)
  const averagegmv = computed(() => variablesStore.processedData.off_havg_gmv)
  
  // Watcher reacting to changes in fromIndex or toIndex
  watch([fromIndex, toIndex], ([newFrom, newTo], [oldFrom, oldTo]) => {
    updateEstimations(newFrom, newTo);
  }, { deep: true });
  
  // Function to update estimations based on current range
  function updateEstimations(from, to) {
    const dataOutsideRange = [...actualgmv.value.slice(0, from), ...actualgmv.value.slice(to + 1)];
    const averagesOutsideRange = [...averagegmv.value.slice(0, from), ...averagegmv.value.slice(to + 1)];
  
    const differences = dataOutsideRange.map((value, index) => value - averagesOutsideRange[index]);
    const averageDifference = differences.reduce((acc, diff) => acc + diff, 0) / (differences.length || 1);
  
    const estimatedActualGmvInsideRange = averagegmv.value.slice(from, to + 1).map(value => value + averageDifference);
    console.log(estimatedActualGmvInsideRange, "estimatedActualGmvInsideRange");
  
    // Sum up the estimated GMV inside the range
    const sumEstimatedGmv = estimatedActualGmvInsideRange.reduce((acc, val) => acc + val, 0);
  
    // Get actual GMV inside the range and sum it up
    const sumActualGmv = actualgmv.value.slice(from, to + 1).reduce((acc, val) => acc + val, 0);
  
    // Calculate the extra and update the store
    const extra = sumEstimatedGmv - sumActualGmv;
    console.log(extra, "Extra GMV");
    variablesStore.setExtraGmv(extra); // Assuming this is the method to update the store
  }
  
  // Trigger updateEstimations on component mount
  onMounted(() => {
    updateEstimations(fromIndex.value, toIndex.value);
  });
  
  </script>
  
  <style scoped>
  </style> -->