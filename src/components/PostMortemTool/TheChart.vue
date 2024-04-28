<template>
    <div>
        <v-chart v-if="isDataLoaded" :option="chartOption" style="width: 90%; height: 550px;"></v-chart>
    </div>
</template>

<script setup>
import { ref, resolveDirective, watch } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 
import ECharts from 'vue-echarts';
import 'echarts';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


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
    axisLabel: {
        formatter: function (value) {
            // Ensures the hour is always shown with two digits
            return value < 10 ? `0${value}:00` : `${value}:00`;
        }
    }
},
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: function (value) {
                const factor = variablesStore.data && variablesStore.data.gmv_part ? variablesStore.data.gmv_part[1] : 1;
                return `€${numberWithCommas(Math.round(value * factor))}`;
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
                return `Hour: ${actualGmvPoint.axisValue}:00 UTC<br>Actual GMV: ${numberWithCommas(realValue.toFixed(0))}€
                <br>Expected GMV: ${numberWithCommas(avgValue.toFixed(0))}€`;
            }
        }
    },



    legend: {
        data: ['Average Expected GMV', 'Min', 'Max', 'Actual GMV', 'Affected Timeframe'], 
        orient: 'horizontal',
        bottom: 10, 
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
                color: 'rgba(237, 150, 50, 1)',
                width: 3
            },
            itemStyle: {
                color: 'rgba(237, 150, 50, 1)'
            }
        },
        {
      name: 'Affected Timeframe',
      type: 'line',
      markLine: {
                silent: true,
                symbol: ['none', 'none'],
                data: [],
                lineStyle: {
                    color: 'rgba(200, 0, 0, 0.4)',
                    width: 1.5
                },
                label: {
        show: false  // Disables the display of values on the markLine
    }
            },
      markArea: {
        silent: true,
        itemStyle: {
                    color: 'rgba(255, 0, 0, 0.05)'
                },
        data: []  
      },
      tooltip: {
        show: false
      }
    }
  ],
});

const isDataLoaded = ref(false);

// Function to update the markLine if ontime and offtime are available
function updateMarkLine() {
  if (variablesStore.ontime !== undefined && variablesStore.offtime !== undefined) {
    chartOption.value.series[4].markLine.data = [
      { xAxis: variablesStore.ontime },
      { xAxis: variablesStore.offtime }
    ];
    chartOption.value.series[4].markArea.data = [
      [
        { xAxis: variablesStore.ontime },
        { xAxis: variablesStore.offtime }
      ]
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

watch(() => variablesStore.isNegative, (newValue) => {
    chartOption.value.series[4].markArea.itemStyle.color = newValue ? 'rgba(150, 0, 0, 0.05)' : 'rgba(0, 150, 0, 0.05)';
    chartOption.value.series[4].markLine.lineStyle.color = newValue ? 'rgba(200, 0, 0, 0.4)' : 'rgba(0, 150, 0, 0.8)';
});

watch(() => [variablesStore.ontime, variablesStore.offtime], updateMarkLine, { immediate: true, deep: true });

</script>


<style>

</style>
