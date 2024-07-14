<template>
<div class="topwrap">    
<h1 class="title">Post-Mortem Analysis Dashboard</h1>
<DashInput class="input"></DashInput>
</div>
    <div class="container">
<div class="one">1</div>
<div class="two">2</div>
<div class="three">3</div>
<div class="four">4</div>
<div class="five">5</div>
<div class="six">6</div>
</div>
</template>


<script setup>
import DashInput from "../components/TheDashboard/DashInput.vue"
</script>


<style scoped>
.container {
    padding: 1rem;
    display: flex;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
}

.one, .two, .three, .four, .five, .six {
    background-color: red;
    width: 32%;
    height: 48%;
}


.title {
 margin-left: 3rem;
 width: 25%;
}

.input {
    width: 15%;
    scale: 0.9;
}

.topwrap {
    display: flex;
    align-items: flex-start;
    margin-top: 2rem;
    width: 100%;

}


</style>