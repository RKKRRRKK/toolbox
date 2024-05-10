<template>
    <h1 class="title">Post-Mortem GMV Impact Estimation {{ date }}</h1>
    <div class="container">
        <div class="horizontal-container">
            <div class="ho-basics">
                <div class="basics">
                    <TheDates></TheDates>
                    <div class="rest">
                        <TheStorefront></TheStorefront>
                        <ThePlatform></ThePlatform>
                    </div>
                </div>
                <TheGenerate></TheGenerate>
            </div>
            <div class="inputs">
                <TheInput></TheInput>
            </div>
            <div class="compwrap">
            <div></div>
            <TheCompressor class="compressor"></TheCompressor>
        </div>
        </div>
        <TheResult class="result"></TheResult>
        <!-- <div class="chart">chart</div> --> <!-- Corrected malformed comment -->
        <div class="charts">
            <TheChart></TheChart>
            <TheScatter></TheScatter>
        </div>
    </div>
</template>


<script setup>
import TheDates from "../components/PostMortemTool/TheDates.vue"
import TheStorefront from "../components/PostMortemTool/TheStorefront.vue"
import ThePlatform from "../components/PostMortemTool/ThePlatform.vue"
import TheGenerate from "../components/PostMortemTool/TheGenerate.vue"
import TheInput from "../components/PostMortemTool/TheInput.vue"
import TheChart from "../components/PostMortemTool/TheChart.vue"
import TheResult from "../components/PostMortemTool/TheCalculation.vue"
import TheScatter from "../components/PostMortemTool/TheScatter.vue"
import TheCompressor from "../components/PostMortemTool/TheCompressor.vue"
import TheSlider from "../components/PostMortemTool/TheSlider.vue"
import { ref, watch } from 'vue'

const date = ref('')
      
      import { useVariablesStore } from '@/stores/PostMortem/variables.js' 
      const variablesStore = useVariablesStore()

      watch(() => variablesStore, (newData) => {
        date.value = newData.start ? 'for ' + newData.start : ''

      },
      { immediate: true, deep: true });

</script>


<style scoped>

.container {
    padding-top: 2.5rem;
    padding-left: 10rem;
    width: 100vw;
    height: 100vh;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    flex-grow: 3;
    flex-shrink: 3;
    flex-basis: 0%;
}

.basics {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-left: 2.5rem;
    flex-shrink: 3;
    flex-basis: 0%
}


.rest {
    display: flex;
    gap: 6.5rem;
    width: 13rem;
    height: 1rem;
    flex-shrink: 3;
    flex-basis: 0%
}

.ho-basics {
    display: flex;
    gap: 1rem;
    margin-right: 2rem;
    flex-shrink: 3;
    flex-basis: 0%;
    border: 2px solid #ccc;
    padding: 1rem;
    padding-right: 2.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* subtle shadow for depth */
    border-radius: 0.5rem;
}

.inputs {
    border: 2px solid #ccc;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* lighter shadow for input fields */
    border-radius: 0.5rem;
}




.horizontal-container {
    display: flex;
    width: 100%;
    gap: 1rem;
    padding-left: 8rem;
    flex-shrink: 3;
    flex-basis: 0%;
}


/* .chart {
    margin-top: 2.5rem;
    width: 95%;
    align-self: center;
    justify-self: center;
    height: 100%;
    flex-shrink: 3;
    flex-basis: 0%
} */

.result {
    padding: 0.5rem;
    margin-left: 11rem;
    margin-bottom: 2rem;
    flex-shrink: 3;
    flex-basis: 0%;
}

.charts {
    overflow: hidden; 
    width: 100%;
}


.charts > :first-child {
    float: left; 
    width: 80%; 
    box-sizing: border-box; 
    /* background-color: rgba(120,120,120,0.5) */
}

.charts > :last-child {
    float: left; 
    width: 20%; 
    box-sizing: border-box;
    /* background-color: rgba(50,50,255, 0.5) */
}

.title {
    color: #636060; 
}

.compressor {
    align-self: flex-start;
}

.compwrap {
    display: flex;
    justify-content: space-between;
    width: 52.5%;
}
</style>