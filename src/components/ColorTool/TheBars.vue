<template>
  <div id="wrapper">
    <div
      v-for="index in barCount"
      :key="index"
      :style="getBarStyle(index -1)"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBarsStore } from '@/stores/bars'
import { useColorsStore } from '@/stores/colors'
import { watch } from 'vue'

const barsStore = useBarsStore()
const colorsStore = useColorsStore()

// Use computed to reactively track changes to barCount
const barCount = computed(() => barsStore.count)
// Use computed to reactively track changes to barColors
const barColors = computed(() => colorsStore.barColors)

watch(
  () => barsStore.count,
  () => {
    colorsStore.createHarmony(colorsStore.harmony)
  },
  { immediate: true }
)

const getBarStyle = (index) => ({
  backgroundColor: barColors.value[index], //removed -1 index
  width: `${100 / barCount.value}%`,
  height: '30vh'
});

</script>

<style scoped>
#wrapper {
  flex-direction: row;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
}
</style>
