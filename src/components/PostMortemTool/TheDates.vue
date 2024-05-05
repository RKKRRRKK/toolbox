<template>
    <div class="dates">
        <div class="field-container">
            <label for="start">Start Time:</label>
            <input type="datetime-local" id="start" class="start" step="3600"
            v-model="starttime"
            @change="setstarttime"
            >
        </div>
        <div class="field-container">
            <label for="end">End Time:</label>
            <input type="datetime-local" id="end" class="end"  step="3600"
            v-model="endtime"
            @change="setendtime"
            >
        </div>
    </div>
    </template>

<script setup>
import { ref } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables.js'; 
import date from '../PostMortemTool/DatePicker.vue';

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
  variablesStore.setofftime(Math.floor(timeAsFloat));  ///changed this floor for now 
  console.log("startime set", datePart, "offtime set", timeAsFloat);
}

function setendtime() {
  const datePart = endtime.value.split('T')[0];
  const timePart = endtime.value.split('T')[1];
  const hours = parseInt(timePart.split(':')[0]);
  const minutes = parseInt(timePart.split(':')[1]);
  let timeAsFloat = hours + minutes / 60;
  timeAsFloat = timeAsFloat.toFixed(2)

  variablesStore.setendtime(datePart);
  variablesStore.setontime(Math.floor(timeAsFloat));  ///changed this floor for now 
  console.log("endtime set", datePart, "ontime set", timeAsFloat);
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