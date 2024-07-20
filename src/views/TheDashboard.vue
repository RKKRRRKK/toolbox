<template>
<div class="topwrap">    
<h1 class="title">Post-Mortem Analysis Dashboard</h1>
<DashInput class="input"></DashInput>
<PaymentMethodSelector></PaymentMethodSelector>
</div>
    <div class="container">
<HourlyLine class="one"></HourlyLine>
<PaymentBar class="two"></PaymentBar>
<HealthMetrics class="three"></HealthMetrics>
<div class="four">4</div>
<div class="five">5</div>
<div class="six">6</div>
</div>
</template>


<script setup>
import DashInput from "../components/TheDashboard/DashInput.vue"
import HealthMetrics from "../components/TheDashboard/HealthMetrics.vue"
import PaymentBar from "../components/TheDashboard/PaymentBar.vue"
import HourlyLine from "../components/TheDashboard/HourlyLine.vue"
import PaymentMethodSelector from "../components/TheDashboard/PaymentMethodSelector.vue"
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

 .four, .five, .six {
    background-color: red;
}

.one, .two, .three, .four, .five, .six {
    width: 32%;
    height: 50%;
    max-width: 32%; /* Prevent exceeding width */
    max-height: 48%; /* Prevent exceeding height */
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