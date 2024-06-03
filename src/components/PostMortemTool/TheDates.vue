<template>
        <div class="field-container">
            <label for="start">Date:</label>
            <input type="date" id="start" class="start"
            v-model="startdate"
            @change="setstartdate"
            >
        </div>
</template>

<script setup>
import { ref } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables.js';

const variablesStore = useVariablesStore();
const startdate = ref(variablesStore.start);

function setstartdate() {
  variablesStore.setstarttime(startdate.value);
  console.log("startdate set", startdate.value);
}
</script>

<style scoped>

.field-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.start {
    border: 1px solid #ccc;
    border-radius: 0.2rem;
}
</style>