<template>
<div class="container">

<div class="horizontal-container">
<div class="ho-basics">
<div class="basics">
    <TheDates></TheDates>
<div class="rest">
    <TheStorefront class="storefront"></TheStorefront>
    <ThePlatform class="platform"></ThePlatform>
</div>
</div>
    <TheGenerate class="gen"></TheGenerate>
</div>
    <TheInput></TheInput>
</div>
<div class="result">results of the calculation</div>
<!-- <div class="chart">chart</div>> -->
<TheChart></TheChart>
</div>
</template>

<script setup>
import TheDates from "../components/PostMortemTool/TheDates.vue"
import TheStorefront from "../components/PostMortemTool/TheStorefront.vue"
import ThePlatform from "../components/PostMortemTool/ThePlatform.vue"
import TheGenerate from "../components/PostMortemTool/TheGenerate.vue"
import TheInput from "../components/PostMortemTool/TheInput.vue"
import TheChart from "../components/PostMortemTool/TheChart.vue"
</script>


<style scoped>

.container {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 1rem;
    flex-direction: column;
}

.basics {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-left: 2.5rem;
}




.copy, .paste {
    border:solid black;
}



.rest {
    display: flex;
    gap: 3rem;
    width: 13rem;
    height: 1rem;
}

.ho-basics {
    display: flex;
    gap: 1rem;
}




.horizontal-container {
    display: flex;
    width: 100%;
    gap: 1rem;
}

.result {
    margin-top: 5rem;
    width: 25rem;
    height: 10rem;
    margin-left: 2.5rem;
}

.chart {
    margin-top: 2.5rem;
    width: 95%;
    align-self: center;
    justify-self: center;
    height: 100%;
}


</style>