<template>
    <div>
        <div class="slider-container">
        </div>
        <v-chart class="chart" v-if="isDataLoaded" :option="chartOption"  @click="onBarClick"></v-chart>
    </div>
</template>

<script setup>
import { ref, resolveDirective, watch, provide, computed } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 
import ECharts, { THEME_KEY } from 'vue-echarts';
import 'echarts';

const variablesStore = useVariablesStore();
const selectedBars = ref([]);
const offtimes = ref([...variablesStore.offtimes]);

// const theme = computed(() => variablesStore.darkMode ? 'dark' : 'light');

// watch(variablesStore.darkMode, (newValue) => {
//    console.log("theme changed at TheChart.vue to: ", newValue)
//    console.log("theme changed at TheChart.vue to: ", theme)
// })


// provide(THEME_KEY, "`${theme}`");

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function timeframeToggle(params) {
    const isSelected = params.selected[params.name];
    console.log(isSelected, params.name);
    if (params.name == 'Affected Timeframe') {
    variablesStore.setTimeframe(isSelected) 
    }
}

function refreshChart() {
    chartOption.value = { ...chartOption.value };
}

function onBarClick(params) {
    console.log('click went through')
    if (params.seriesName === 'Actual GMV') {
        const index = params.dataIndex;
        const isSelectedIndex = selectedBars.value.indexOf(index);
        if (isSelectedIndex > -1) {
            selectedBars.value.splice(isSelectedIndex, 1); // Deselect
        } else {
            selectedBars.value.push(index); // Select
        }
        console.log('refreshed chart with', selectedBars.value);
        variablesStore.setOfftimes(selectedBars.value);
        refreshChart();
    }
}




function mapNormalizedToReal(index) {
    return variablesStore.model === 'normalized' ? 
        variablesStore.processedData.on_h_gmv[index] : 
        index;  
}

function mapNormalizedToRealAvg(index) {
    return variablesStore.model === 'normalized' ? 
        variablesStore.processedData.avg_norm_gmv_converted[index] :  
        index;  
}


const chartOption = ref({
    xAxis: {
    type: 'value',
    interval: 1,
    max: 24,
    min: -1,
    axisLabel: {
        formatter: function (value) {
          
            return value > -1 && value < 24 ? `${value}-${value + 1}:00` : `` 
        }
    },
    splitLine: {
            show: true,
            lineStyle: {
                color: '#ccc', 
                type: 'dashed' 
            }
        }
        
},
yAxis: {
        type: 'value',
        axisLabel: {
            formatter: function (value) {
                if (variablesStore.model === 'normalized') {
                    const factor = variablesStore.processedData?.gmv_part?.[1] || 1;
                    return `${numberWithCommas(Math.round(value * factor))} €`;
                } else {
                    return `${numberWithCommas(Math.round(value))} €`;
                }
            }
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            const actualGmvPoint = params.find(p => p.seriesName === 'Actual GMV');
            if (actualGmvPoint) {
                if (variablesStore.model === 'normalized') {
                    const realValue = mapNormalizedToReal(actualGmvPoint.dataIndex);
                    const avgValue = mapNormalizedToRealAvg(actualGmvPoint.dataIndex);
                    return `Time: Between ${Math.floor(actualGmvPoint.axisValueLabel)}:00  and  ${Math.floor(actualGmvPoint.axisValueLabel) }:59<br>Actual GMV: ${numberWithCommas(realValue.toFixed(0))}€
                    <br>Expected GMV: ${numberWithCommas(avgValue.toFixed(0))}€`;
                } else {
                    const realValue = variablesStore.processedData.on_h_gmv[actualGmvPoint.dataIndex];
                    const avgValue = variablesStore.processedData.off_havg_gmv[actualGmvPoint.dataIndex];
                    return `Hour: ${actualGmvPoint.axisValueLabel}<br>Actual GMV: ${numberWithCommas(realValue.toFixed(0))}€
                    <br>Expected GMV: ${numberWithCommas(avgValue.toFixed(0))}€`;
                }
            }
        }
    },

    grid: {
    left: '2%',  
    right: '2%',
    top: '7%',
    bottom: '15%',
    containLabel: true
  },



    legend: {
        data: ['Average (Expected) GMV', 'Min', 'Max', 'Actual GMV'], 
        orient: 'horizontal',
        bottom: 10, 
        left: 'center' 
        
    },

    title: {
        text: 'Hourly Comparison',
        textAlign: 'middle',
        textStyle: {
            fontSize: 20,
        },
        padding: [
    0,  // up
    0, // right
    0,  // down
    200, // left
]
    },

    
    
    
    series: [
        { 
            name: 'Average (Expected) GMV', 
            data: [], 
            type: 'bar',
            stack: 'x',
            lineStyle: {
                color: 'red',
                width: 2,
                opacity: 1,
            },
            itemStyle: {
                color: '#F0F0F0',
                opacity: 1,
            },
            showSymbol: false
        },
        { 
            name: 'Min', 
            data: [], 
            type: 'line',
            symbol: 'rect',
            symbolSize: [20, 5],
            lineStyle: {
                width: 0,
            },
            itemStyle: {
                color: 'gray',
                opacity: 0.35,
            },
            showSymbol: true
        },
        { 
            name: 'Max', 
            data: [], 
            type: 'line',
            symbol: 'rect',
            symbolSize: [20, 5],
            lineStyle: {
                width:  0,
            },
            itemStyle: {
                color: 'gray',
                opacity: 0.35,
            },
            
            showSymbol: true
        },
        { 
            name: 'Actual GMV', 
            data: [], 
            type: 'bar',
            symbolSize: 10,
            symbol: 'circle',
            stack: 'x',
            lineStyle: {
                color: 'ccc',
                width: 3.5,
            },
            itemStyle: {
                color: (params) => {
            return selectedBars.value.includes(params.dataIndex) ? 'rgba(245, 50, 20, 0.75)' : 'rgba(237, 150, 50, 0.5)';
        }
    
            }
        },
      
  ],
});

const isDataLoaded = ref(false);


watch(() => variablesStore.processedData, (newData) => {
    if (newData) {
        if (variablesStore.model === 'normalized')
        {
        chartOption.value.series[0].data = newData.avg_norm_gmv ? newData.avg_norm_gmv.map((value, index) => [index, value]) : [];
        chartOption.value.series[1].data = newData.min_norm_gmv ? newData.min_norm_gmv.map((value, index) => [index, value]) : [];
        chartOption.value.series[2].data = newData.max_norm_gmv ? newData.max_norm_gmv.map((value, index) => [index, value]) : [];
        chartOption.value.series[3].data = newData.normalizedActualGMV ? newData.normalizedActualGMV.map((value, index) => [index, value]) : [];
        }
        else if (variablesStore.model === 'simple') 
        {
        chartOption.value.series[0].data = newData.avg_flat_gmv ? newData.avg_flat_gmv.map((value, index) => [index, value]) : [];
        chartOption.value.series[1].data = newData.min_flat_gmv ? newData.min_flat_gmv.map((value, index) => [index, value]) : [];
        chartOption.value.series[2].data = newData.max_flat_gmv ? newData.max_flat_gmv.map((value, index) => [index, value]) : [];
        chartOption.value.series[3].data = newData.on_h_gmv ? newData.on_h_gmv.map((value, index) => [index, value]) : [];
        }
        if (newData.normalizedActualGMV) {
            isDataLoaded.value = true;
        }
        console.log("updating is loaded value", isDataLoaded.value)
    }
}, { immediate: true, deep: true });



</script>


<style>

.chart {
    width: 100%;
    height: 100%;
    min-height: 20rem;
}

.slider-container {
    display: flex;
    justify-content: center;
    padding-left: 4rem;  
}


.slider {
    width: 100%; 
    transform: translateY(MAX(0rem, 5vh));
}


</style>
