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

function mapNormalizedToReal(index) {
    // This assumes 'actual_gmv_euros' is loaded and has the same length as the normalized 'actual_gmv'
    if (variablesStore.data && variablesStore.data.actual_gmv_euros) {
        return variablesStore.data.actual_gmv_euros[index];
    }
    return null;
}

function mapNormalizedToRealAvg(index) {
    // This assumes 'actual_gmv_euros' is loaded and has the same length as the normalized 'actual_gmv'
    if (variablesStore.data && variablesStore.data.average_gmv_euros) {
        return variablesStore.data.average_gmv_euros[index];
    }
    return null;
}


const chartOption = ref({
    xAxis: {
        type: 'value',  
        interval: 1,
        max: 23,
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: function (value) {
                const factor = variablesStore.data && variablesStore.data.gmv_part ? variablesStore.data.gmv_part[1] : 1;
                return `€${Math.round(value * factor)}`;
            }
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            const actualGmvPoint = params.find(p => p.seriesName === 'Actual GMV');
            if (actualGmvPoint) {
                const realValue = mapNormalizedToReal(actualGmvPoint.dataIndex);
                const avgValue = mapNormalizedToRealAvg(actualGmvPoint.dataIndex);
                return `Hour: ${actualGmvPoint.axisValue}<br>Actual GMV: €${realValue.toFixed(2)}
                <br>Expected GMV: €${avgValue.toFixed(2)}`;
            }
        }
    },


    legend: {
        data: ['Average Expected GMV', 'Min', 'Max', 'Actual GMV'], 
        orient: 'horizontal',
        top: 10, 
        left: 'center' 
    },

    
    
    
    series: [
        { 
            name: 'Average Expected GMV', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'black',
                width: 2,
                opacity: 0.35,
            },
            itemStyle: {
                color: 'black',
                opacity: 0.35,
            },
            showSymbol: false
        },
        { 
            name: 'Min', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'black',
                width: 1,
                type: 'dashed',
                opacity: 0.20
            },
            
            itemStyle: {
                color: 'black',
                opacity: 0.20,
            },
            showSymbol: false
        },
        { 
            name: 'Max', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'black',
                width: 1,
                type: 'dashed',
                opacity: 0.20
            },
            itemStyle: {
                color: 'black',
                opacity: 0.20,
            },
            
            showSymbol: false
        },
        { 
            name: 'Actual GMV', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'red',
                width: 3
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
