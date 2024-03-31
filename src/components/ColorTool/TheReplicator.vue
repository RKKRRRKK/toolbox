<template>
  <div id="container">
    <button @click="addBar">Add Color</button>
    <button @click="removeBar">Remove Color</button>
  </div>
</template>

<script setup>
import { useBarsStore } from '@/stores/bars' 
const barsStore = useBarsStore()

function addBar() {
  barsStore.addBar();
}

function removeBar() {
  barsStore.removeBar();
}




</script>





<style></style>
