<template>
<div class="field-container">
<label for="storefronts">Storefront:</label>
<select name="storefronts" id="storefronts"
  v-model="storefront"
  @change="setstorefront"
  >
  <option value="cz">CZ</option>
  <option value="sk">SK</option>
  <option value="de">DE</option>
  <option value="all">ALL</option>
</select>
</div>
<!-- <div class="storefront">storefront</div>     -->
</template>

<script setup>
 import { ref, watch } from 'vue'
  
  import { useVariablesStore } from '@/stores/PostMortem/variables.js' 
  const variablesStore = useVariablesStore()
  const storefront = ref(variablesStore.storefront)


  function setstorefront() {
    variablesStore.setstorefront(storefront.value)
    console.log("storefront set", storefront.value )
  }
 

</script>

<style scoped>



</style>