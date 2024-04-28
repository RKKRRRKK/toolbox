<template>
<div class="field-container">
<label for="platform">Platform:</label>
<select name="platform" id="platform"
  v-model="platform"
  @change="setplatform"
  >
  <option value="'web'">WEB</option>
  <option value="'app'">APP</option>
  <option value="'web','app'">ALL</option>
</select>
</div>

</template>

<script setup>
 import { ref } from 'vue'
  
  import { useVariablesStore } from '@/stores/PostMortem/variables.js' 
  const variablesStore = useVariablesStore()
  const platform = ref(variablesStore.platform)


  function setplatform() {
    variablesStore.setplatform(platform.value)
    console.log("platform set", platform.value )
  }
 

</script>

<style scoped>



</style>