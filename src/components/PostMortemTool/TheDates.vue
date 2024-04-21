<template>
    <div class="dates">
        <div class="field-container">
            <label for="start">Start Time:</label>
            <input type="datetime-local" id="start" class="start"
            v-model="starttime"
            @change="setstarttime"
            >
        </div>
        <div class="field-container">
            <label for="end">End Time:</label>
            <input type="datetime-local" id="end" class="end"
            v-model="endtime"
            @change="setendtime"
            >
        </div>
    </div>
    </template>

<script setup>
import { ref } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables.js'; 

const variablesStore = useVariablesStore();
const starttime = ref(variablesStore.start);
const endtime = ref(variablesStore.end);

function setstarttime() {
  const datePart = starttime.value.split('T')[0];
  const timePart = starttime.value.split('T')[1];
  const hours = parseInt(timePart.split(':')[0]);
  const minutes = parseInt(timePart.split(':')[1]);
  let timeAsFloat = hours + minutes / 60;
  timeAsFloat = timeAsFloat.toFixed(2)
  
  variablesStore.setstarttime(datePart);
  variablesStore.setontime(timeAsFloat);
  console.log("startime set", datePart, "ontime set", timeAsFloat);
}

function setendtime() {
  const datePart = endtime.value.split('T')[0];
  const timePart = endtime.value.split('T')[1];
  const hours = parseInt(timePart.split(':')[0]);
  const minutes = parseInt(timePart.split(':')[1]);
  let timeAsFloat = hours + minutes / 60;
  timeAsFloat = timeAsFloat.toFixed(2)

  variablesStore.setendtime(datePart);
  variablesStore.setofftime(timeAsFloat);
  console.log("endtime set", datePart, "offtime set", timeAsFloat);
}
</script>

<style scoped>
.dates {
    display: flex;
    gap: 1rem; 
    align-items: flex-start; 
}

.field-container {
    display: flex;
    flex-direction: column; 
    width: 50%;
}

</style>