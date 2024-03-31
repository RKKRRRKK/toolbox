<template>
    <div id="container">
        <p>Saturation</p>
        <input type="range" min=20 max=100 class="slider" id="saturation"
        v-model="saturation"
        @change="saturate" />
        <p>Lightness</p>
        <input type="range" min=35 max=90 class="slider" id="lightness"
        v-model="lightness"
        @change="lighten" />
    </div>
  </template>
  
  <script setup>
  import convert from 'color-convert';
  import { ref, watch } from 'vue'
  
  import { useFiltersStore } from '@/stores/filters' 
  import { useColorsStore } from '@/stores/colors'
  const filtersStore = useFiltersStore()
  const colorsStore = useColorsStore()
  const saturation = ref(filtersStore.saturation)
  const lightness = ref(filtersStore.lightness)


  watch(() => filtersStore.saturation, (newVal) => {
  saturation.value = newVal
}, { immediate: true })


watch(() => filtersStore.lightness, (newVal) => {
  lightness.value = newVal
}, { immediate: true })
  
  function saturate() {
    filtersStore.saturate(saturation.value)
  }
  
  function lighten() {
    filtersStore.lighten(lightness.value)
  }
  
 
    
  
  </script>
  
  
  
  
  
  <style></style>