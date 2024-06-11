<template>
    <div class="wrap">
      <label for="platform">Selected model:</label>
     <select name="platform" id="platform" class="select"
      v-model="model"
      @change="setModel"
      >
  <option value="simple">simple</option>
  <option value="normalized">normalized</option>
</select>
<button @click="reset_use()" class="refresh">
    <span class="material-icons">refresh</span>
</button>
</div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useVariablesStore } from '@/stores/PostMortem/variables'
import { useEstimationStore } from '@/stores/PostMortem/estimation';

const variablesStore = useVariablesStore()
const estimationStore = useEstimationStore()
const enrichedData = ref(variablesStore.enrichedData)


//handle a case of no offtime in TheCalculation first... 
// function reset_use() {
//   variablesStore.offtimes = []
                          
// }
const model = ref(variablesStore.model)

function setModel() {
    variablesStore.setModel(model.value)
    console.log("model set", model.value)
    console.log("data", variablesStore.data)
    console.log("summedGMV", variablesStore.summedGMV)
    // reset_use()
}






watch(
    [() => variablesStore.summedGMV, () => variablesStore.model, () => estimationStore.result],
    (newValues, oldValues) => {
        const hasChange = newValues.some((newValue, index) => newValue !== oldValues[index]);
        
        if (hasChange) {
            calculateData();
        }
    },
    { immediate: false, deep: true }
);
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

    //  parse JSON strings into arrays
    function parseJSON(jsonStr) {
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error('Failed to parse JSON:', jsonStr, e);
            return [];  // Return empty array in case of error
        }
    }

    // arrays to store calculated values and new metrics
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

    //norm * gmv_part
    let avg_norm_gmv_converted = []
    let min_norm_gmv_converted = []
    let max_norm_gmv_converted = []



   
    data.on_h_gmv.forEach((gmv, index) => {
        const totalGMV = data.on_total_gmv[index] + (estimationStore.result || 0);
        const normalizedGMV = gmv / totalGMV * 100;
        normalizedActualGMV.push(normalizedGMV);
        gmv_part.push(totalGMV / 100)

        // calculating normalizedOffGMV for each entry in array_gmv after parsing it
        const individualNormalizedOffGMV = [];
        const individualFlatOffGMV = [];
        const gmvArray = parseJSON(data.array_gmv[index]);  // parse the JSON string into an array
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

        //flat * gmv_part = normalized for on-day

        avg_norm_gmv_converted.push(average * (totalGMV / 100));
        max_norm_gmv_converted.push(maximum * (totalGMV / 100));
        min_norm_gmv_converted.push(minimum*  (totalGMV / 100));

        
        avg_flat_gmv.push(average_flat);
        max_flat_gmv.push(maximum_flat);
        min_flat_gmv.push(minimum_flat);


        // normalized losses  the expected and actual gmv normalization difference multiplied by the gmv that hour giving us "x"
        avg_norm_loss.push((average / normalizedGMV * gmv) - gmv);
        // console.log("average", average, "/", "normalizedGMV", normalizedGMV, "* gmv", gmv, ")", "- gmv", gmv )
        // console.log( "===", (average / normalizedGMV * gmv) - gmv)
        max_norm_loss.push((maximum / normalizedGMV * gmv) - gmv);
        min_norm_loss.push((minimum / normalizedGMV * gmv) - gmv);


        //flat losses 
        avg_flat_loss.push(average_flat - gmv)
        max_flat_loss.push(maximum_flat - gmv)
        min_flat_loss.push(minimum_flat - gmv)

        //un-normalized flat values 
 
       

    });


    // combine all data into a new object
        
    enrichedData.value = {
        ...data,
        normalizedActualGMV,      
        normalizedOffGMV,
        avg_norm_gmv,
        min_norm_gmv,
        max_norm_gmv,
        avg_norm_loss,
        max_norm_loss,
        min_norm_loss,
        gmv_part,
flatOffGMV,
avg_flat_gmv,
min_flat_gmv,
max_flat_gmv,
avg_flat_loss,
min_flat_loss,
max_flat_loss,
avg_norm_gmv_converted,
min_norm_gmv_converted, 
max_norm_gmv_converted,


    };
    console.log("enrichedData", enrichedData)
    // console.log("enrichedData.avg_norm_loss", enrichedData.avg_norm_loss)
    setData(enrichedData.value)

} //--------------------------END OF CALCULATE DATA FUNCTION   



  
    function setData(enrichedData) {
    variablesStore.setProcessedData(enrichedData);
    console.log("enrichedData set", enrichedData);
}


</script>

<style>

.select {
    font-size: MAX(0.6vw, 0.6rem);
}

.wrap {
    margin-top: -0.5rem;
    font-size: MAX(0.6vw, 0.6rem);
}

.refresh {
  margin-left: 0.5rem;
  scale: 0.8;
  transform: translateY(6px);
  background-color: rgb(234, 179, 117);
  color: #fff;
  border: none;
  border-radius: 0.2rem;
  font-weight: bold;
  cursor: pointer;
}


.refresh:hover {
    background-color: rgba(237, 150, 50, 1);
}

.refresh:active {
        background-color: rgb(82, 50, 14);
        box-shadow: none;
        transform: translateY(7px);
    }


</style>