<template>
    <div>
        <v-chart v-if="isDataLoaded" :option="chartOption" style="width: 90%; height: 550px;"></v-chart>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 
import ECharts from 'vue-echarts';
import 'echarts';

const variablesStore = useVariablesStore();

const chartOption = ref({
    xAxis: {
        type: 'value',  // Changed to 'value' to handle numerical data correctly
        interval: 1,
    },
    yAxis: {
        type: 'value'
    },
    legend: {
        data: ['Average GMV', 'Q1', 'Q3', 'Actual GMV'], 
        orient: 'horizontal',
        bottom: 10, 
        left: 'center' 
    },
    series: [
        { 
            name: 'Average GMV', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'black',
                width: 5
            },
            itemStyle: {
                color: 'black'
            }
        },
        { 
            name: 'Q1', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'black',
                width: 5,
                type: 'dashed',
                opacity: 0.25
            },
            showSymbol: false
        },
        { 
            name: 'Q3', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'black',
                width: 5,
                type: 'dashed',
                opacity: 0.25
            },
            showSymbol: false
        },
        { 
            name: 'Actual GMV', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'red',
                width: 5
            },
            itemStyle: {
                color: 'red'
            },
            markLine: {
                silent: true,
                data: []  // This will be set dynamically
            }
        }
    ],
});

const isDataLoaded = ref(false);

// Function to update the markLine if ontime and offtime are available
function updateMarkLine() {
    if (variablesStore.ontime !== undefined && variablesStore.offtime !== undefined) {
        chartOption.value.series[3].markLine.data = [
            { xAxis: variablesStore.ontime },
            { xAxis: variablesStore.offtime }
        ];
    }
}

watch(() => variablesStore.data, (newData) => {
    if (newData) {
        chartOption.value.series[0].data = newData.average_gmv ? newData.average_gmv.map((value, index) => [index, value]) : [];
        chartOption.value.series[1].data = newData.Q1 ? newData.Q1.map((value, index) => [index, value]) : [];
        chartOption.value.series[2].data = newData.Q3 ? newData.Q3.map((value, index) => [index, value]) : [];
        chartOption.value.series[3].data = newData.actual_gmv ? newData.actual_gmv.map((value, index) => [index, value]) : [];
        updateMarkLine();  // Ensure markLine is updated alongside the data
        isDataLoaded.value = true;
    }
}, { immediate: true, deep: true });

watch(() => [variablesStore.ontime, variablesStore.offtime], updateMarkLine, { immediate: true, deep: true });

</script>


<style>
/* Style as needed */
</style>
