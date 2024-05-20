<template>
      <label for="platform">Selected model:</label>
     <select name="platform" id="platform" class="select"
      v-model="model"
      @change="setModel"
      >
  <option value="simple">simple</option>
  <option value="normalized">normalized</option>
</select>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useVariablesStore } from '@/stores/PostMortem/variables'

const variablesStore = useVariablesStore()

const model = ref(variablesStore.model)

function setModel() {
    variablesStore.setModel(model.value)
    console.log("model set", model.value)
    console.log("data", variablesStore.data)
    console.log("summedGMV", variablesStore.summedGMV)
}

// Assuming data is fetched and reactive

// Watch the summedGMV property


watch(() => variablesStore.summedGMV, (newData) => {
    if (newData) {
        calculateData();
    }
}, { immediate: false, deep: true });
function parseJSON(jsonStr) {
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Failed to parse JSON:', jsonStr, e);
        return [];
    }
}

function calculateData() {
    console.log("Calculating data");

    const { data, summedGMV } = variablesStore;

    // Helper function to safely parse JSON strings into arrays
    function parseJSON(jsonStr) {
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error('Failed to parse JSON:', jsonStr, e);
            return [];  // Return empty array in case of error
        }
    }

    // New arrays to store calculated values and new metrics
    const normalizedActualGMV = [];
    const normalizedOffGMV = [];
    const avg_norm_gmv = [];
    const min_norm_gmv = [];
    const max_norm_gmv = [];
    const avg_norm_loss = [];
    const max_norm_loss = [];
    const min_norm_loss = [];
    const gmv_part = [];

    // Process only necessary data to calculate new values
    data.on_h_gmv.forEach((gmv, index) => {
        const totalGMV = data.on_total_gmv[index];
        const normalizedGMV = gmv / totalGMV * 100;
        normalizedActualGMV.push(normalizedGMV);
        gmv_part.push(totalGMV / 100)

        // Calculating normalizedOffGMV for each entry in array_gmv after parsing it
        const individualNormalizedOffGMV = [];
        const gmvArray = parseJSON(data.array_gmv[index]);  // Parse the JSON string into an array
        gmvArray.forEach((gmvValue, gmvIndex) => {
            const normalized = (gmvValue / summedGMV[gmvIndex % summedGMV.length]) *100;
            individualNormalizedOffGMV.push(normalized);
        });
        normalizedOffGMV.push(individualNormalizedOffGMV);

        // Calculate avg, max, and min for normalizedOffGMV
        const average = (individualNormalizedOffGMV.reduce((a, b) => a + b, 0) / individualNormalizedOffGMV.length);
        const maximum = (Math.max(...individualNormalizedOffGMV));
        const minimum = (Math.min(...individualNormalizedOffGMV));

        avg_norm_gmv.push(average);
        max_norm_gmv.push(maximum);
        min_norm_gmv.push(minimum);

        // normalized losses
        avg_norm_loss.push((average / normalizedGMV * gmv) - gmv);
        max_norm_loss.push((maximum / normalizedGMV * gmv) - gmv);
        min_norm_loss.push((minimum / normalizedGMV * gmv) - gmv);
    });



    // Combine all data into a new enriched object
    const enrichedData = {
        ...data, // Spread existing data to preserve untouched values
        normalizedActualGMV,
        normalizedOffGMV,
        avg_norm_gmv,
        min_norm_gmv,
        max_norm_gmv,
        avg_norm_loss,
        max_norm_loss,
        min_norm_loss,
        gmv_part,

    };

    // Assign computed results to the reactive object
    variablesStore.setProcessedData(enrichedData);

    console.log(enrichedData);
}

</script>