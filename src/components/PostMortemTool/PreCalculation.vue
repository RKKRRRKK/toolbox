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
    let normalizedActualGMV = [];
    let normalizedOffGMV = [];
    let avg_norm_gmv = [];
    let min_norm_gmv = [];
    let max_norm_gmv = [];
    let avg_norm_loss = [];
    let max_norm_loss = [];
    let min_norm_loss = [];
    const gmv_part = [];

    //flat ones
    let flatOffGMV = [];
    let avg_flat_gmv = [];
    let min_flat_gmv = [];
    let max_flat_gmv = [];
    let avg_flat_loss = [];
    let max_flat_loss = [];
    let min_flat_loss = [];


    // Process only necessary data to calculate new values
    data.on_h_gmv.forEach((gmv, index) => {
        const totalGMV = data.on_total_gmv[index];
        const normalizedGMV = gmv / totalGMV * 100;
        normalizedActualGMV.push(normalizedGMV);
        gmv_part.push(totalGMV / 100)

        // Calculating normalizedOffGMV for each entry in array_gmv after parsing it
        const individualNormalizedOffGMV = [];
        const individualFlatOffGMV = [];
        const gmvArray = parseJSON(data.array_gmv[index]);  // Parse the JSON string into an array
        gmvArray.forEach((gmvValue, gmvIndex) => {
            const normalized = (gmvValue / summedGMV[gmvIndex % summedGMV.length]) *100;
            const flat = gmvValue;
            individualNormalizedOffGMV.push(normalized);
            individualFlatOffGMV.push(flat)
        });
        normalizedOffGMV.push(individualNormalizedOffGMV);
        flatOffGMV.push(individualFlatOffGMV);

        // normalized avg   max and min 
        const average = (individualNormalizedOffGMV.reduce((a, b) => a + b, 0) / individualNormalizedOffGMV.length);
        const maximum = (Math.max(...individualNormalizedOffGMV));
        const minimum = (Math.min(...individualNormalizedOffGMV));

        //flat avg   max and min
        const average_flat = (individualFlatOffGMV.reduce((a, b) => a + b, 0) / individualFlatOffGMV.length);
        const maximum_flat = (Math.max(...individualFlatOffGMV));
        const minimum_flat = (Math.min(...individualFlatOffGMV));

        avg_norm_gmv.push(average);
        max_norm_gmv.push(maximum);
        min_norm_gmv.push(minimum);

        
        avg_flat_gmv.push(average_flat);
        max_flat_gmv.push(maximum_flat);
        min_flat_gmv.push(minimum_flat);


        // normalized losses
        avg_norm_loss.push((average / normalizedGMV * gmv) - gmv);
        max_norm_loss.push((maximum / normalizedGMV * gmv) - gmv);
        min_norm_loss.push((minimum / normalizedGMV * gmv) - gmv);


        //flat losses 
        avg_flat_loss.push(avg_flat_gmv - gmv)
        max_flat_loss.push(max_flat_gmv - gmv)
        min_flat_loss.push(min_flat_gmv - gmv)

        //un-normalized flat values 
        if (model === 'normalized') {
            console.log("model is normalized check:", model, "therefore doing nothing")
        }
        else {
            console.log("model is simple check:", model, "therefore setting normalized values to flat")
            normalizedActualGMV = gmv;
            normalizedOffGMV = flatOffGMV;
            avg_norm_gmv = avg_flat_gmv;
            min_norm_gmv = min_flat_gmv;
            max_norm_gmv = max_flat_gmv;
            avg_norm_loss = avg_flat_loss;
            max_norm_loss = max_flat_loss;
            min_norm_loss = min_flat_loss;
        }

       

    });



    // Combine all data into a new enriched object
    const enrichedData = {
        ...data, // Spread existing data to preserve untouched values
        normalizedActualGMV,      //this should be used for yellow line 
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
    console.log("enrichedData set", enrichedData);
    variablesStore.setStartingPosition(enrichedData.avg_norm_loss);
    console.log("starting position set", enrichedData);


}

</script>