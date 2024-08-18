<template>
    <div class="topwrap">
        <h1 class="title">Post-Mortem Analysis Dashboard</h1>
        <DashInput class="input"></DashInput>
        <PaymentMethodSelector></PaymentMethodSelector>
        <DateFilter></DateFilter>
    </div>
        <div class="container">
            <div class="one">
                <button class="toggle_agg" @click="toggleView">{{ sidline ? 'Show GMV' : 'Show SID Count' }}</button>
                <HourlyLine class="onediv" v-if="!sidline" />
                <HourlySIDLine class="onediv" v-if="sidline" />
            </div>
            <PaymentBar class="two"></PaymentBar>
            <HealthMetrics class="three"></HealthMetrics>
            <div class="four">
            <DonutGMV class="fourdiv"></DonutGMV>
            <DonutSID class="fourdiv"></DonutSID>
            <DonutOS class="fourdiv"></DonutOS>
            <DonutCAT class="fourdiv"></DonutCAT>
            <DonutOS class="fourdiv"></DonutOS>
            <DonutCAT class="fourdiv"></DonutCAT>
            </div>
            <div class="five"></div>
            <div class="six"></div>
        </div>
    </template>

<script setup>
import { ref } from 'vue';
import DashInput from "../components/TheDashboard/DashInput.vue"
import HealthMetrics from "../components/TheDashboard/HealthMetrics.vue"
import PaymentBar from "../components/TheDashboard/PaymentBar.vue"
import HourlyLine from "../components/TheDashboard/HourlyLine.vue"
import PaymentMethodSelector from "../components/TheDashboard/PaymentMethodSelector.vue"
import DateFilter from "../components/TheDashboard/DateFilter.vue"
import DonutGMV from "../components/TheDashboard/DonutGMV.vue"
import DonutSID from "../components/TheDashboard/DonutSID.vue"
import HourlySIDLine from "../components/TheDashboard/HourlySIDLine.vue"
import DonutOS from "../components/TheDashboard/DonutOS.vue"
import DonutCAT from "../components/TheDashboard/DonutCAT.vue"

const sidline = ref(false);

const toggleView = () => {
    sidline.value = !sidline.value;
};
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
    width: 32%;
    height: 50%;
    max-width: 32%; /* Prevent exceeding width */
    max-height: 48%; /* Prevent exceeding height */
}
.six {
    background-color: red;
}
.title {
    margin-left: 3rem;
    width: 25%;
}

.input, .metric-selector {
    width: 15%;
    scale: 0.9;
}

.topwrap {
    display: flex;
    align-items: flex-start;
    margin-top: 2rem;
    width: 100%;
}

.onediv {
    width: 100%;
    height: 100%;
}

.toggle_agg {
  position: absolute;
  z-index: 1;
}

.four {
    display: flex;
    flex-wrap: wrap;
}

.fourdiv {
    width: 33%;
    height: 50%;
}

.fourdiv div {
    background-color: red;
}


.segments {
    position: absolute;
    margin-left: 21rem;
    transform: translateY(-1.5rem)
}


</style>