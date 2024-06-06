<template>
    <div class="container">
        <div class="title-wrap">
        <h1 class="title">Post-Mortem GMV Impact Estimation {{ date }}</h1>
        <!-- <DarkMode></DarkMode> -->
    </div>
        <div class="horizontal-container">
            <TheGuide class="guide"></TheGuide>
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
        <!-- <div class="chart">chart</div> -->
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
import TheGuide from "../components/PostMortemTool/TheGuide.vue"
import DarkMode from "../components/PostMortemTool/DarkMode.vue"
import { ref, watch } from 'vue'

const date = ref('')
      
      import { useVariablesStore } from '@/stores/PostMortem/variables.js' 
      const variablesStore = useVariablesStore()

      watch(() => variablesStore, (newData) => {
        date.value = newData.start ? 'for ' + newData.start : ''

      },
      { immediate: true, deep: true });

//use vh for eleemtns that should shrink 
//use minimum and maximum width


</script>


<style scoped>

.container {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 1rem;
    flex-direction: column; 
    margin-bottom: 5vh;
}

.basics {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-shrink: 3;
    flex-basis: 0%;
    width: 9vw;
    min-width: 125px;
}


.rest {
    display: flex;
    width: 100%;
}

.ho-basics {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 3;
    flex-basis: 0%;
    border: 2px solid #ccc;
    padding: 0.8rem;
    padding-right: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    border-radius: 0.5rem;
    height: 9vh;
    min-height: 7rem;
    min-width: 14rem;
    font-size: 0.8rem;
}


.inputs {
    border: 2px solid #ccc;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    border-radius: 0.5rem;
    width: 12vw;
    height: 12vh;
    min-height: 8rem;
    min-width: 11rem;

  
}




.horizontal-container {
    display: flex;
    width: 100%;
    gap: 4rem;
    padding-left: 8rem;
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
    margin-left: 8rem;
    margin-bottom: 2rem;
    display: flex;
    position: absolute;
    transform: translateY(MAX(28vh, 16.5rem));
    z-index: 999;
    width: 16%;
    min-width: 15rem;
    height: auto;
}

.charts {
    width: 100%;
    display: flex;
    height: 100%;
    /* padding-top: 5rem;
    padding-bottom: 10rem; */
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
    text-align: center;
    margin: auto;
}

.compressor {
    align-self: flex-start;
}

.compwrap {
    display: flex;
    justify-content: space-between;
    width: 52.5%;
}

.guide {
    font-size: max(1.2vh, 0.8rem);
    width: 30rem;
    min-width: 25rem;
    scale: 1;

}

.title-wrap {
    display: flex;
    margin: 1rem;
}
</style>