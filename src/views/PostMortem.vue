<template>
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
    <TheInput></TheInput>
</div>
<TheResult class="result"></TheResult>
<!-- <div class="chart">chart</div>> -->
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
    gap: 3rem;
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
    flex-basis: 0%
}




.horizontal-container {
    display: flex;
    width: 100%;
    gap: 1rem;
    padding-left: 8rem;
    flex-shrink: 3;
    flex-basis: 0%
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
    flex-shrink: 3;
    flex-basis: 0%
}

.charts {
    width: 100%; 
    overflow: hidden; 
}


.charts > :first-child {
    float: left; 
    width: 85%; 
    box-sizing: border-box; 
}

.charts > :last-child {
    float: left; 
    width: 15%; 
    box-sizing: border-box; 
    padding-right: 10rem;
}
</style>