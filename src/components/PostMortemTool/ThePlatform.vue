<template>
<div class="field-container">
<label for="platform">Platform:</label>
<select name="platform" id="platform" class="select"
  v-model="platform"
  @change="setplatform"
  >
  <option value="'web'">WEB</option>
  <option value="'app'">APP</option>
  <option value="'web','app'">ALL</option>
</select>
</div>
<PreCalculation class="wrapper"></PreCalculation>

</template>

<script setup>
 import { ref } from 'vue'
  
  import { useVariablesStore } from '@/stores/PostMortem/variables.js' 
  import PreCalculation from "../PostMortemTool/PreCalculation.vue"
  const variablesStore = useVariablesStore()
  const platform = ref(variablesStore.platform)


  function setplatform() {
    variablesStore.setplatform(platform.value)
    console.log("platform set", platform.value )
  }
 

</script>

<style scoped>

.select {
  border: 1px solid #ccc;
    border-radius: 0.2rem;
}

.wrapper {
  display:none
}


</style>