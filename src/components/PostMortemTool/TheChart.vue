<template>
    <div>
        <v-chart ref="chartRef" class="chart" v-if="isDataLoaded" :option="chartOption"  @click="onBarClick"></v-chart>
    </div>
</template>

<script setup>
import { ref, resolveDirective, watch, provide, computed, onMounted, onUnmounted } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 
import ECharts, { THEME_KEY } from 'vue-echarts';
import 'echarts';

const variablesStore = useVariablesStore();
const selectedBars = ref([...variablesStore.offtimes]);
const offtimes = ref([...variablesStore.offtimes]);


const chartRef = ref(null);

const handleResize = () => {
    // Update the legend's bottom value on resize
    chartOption.value.legend.bottom = calculateLegendBottom();
    chartOption.value.title.padding = calculatePaddingTitle();
    chartOption.value.title.textStyle.fontSize = calculateTitleFontSize();
    chartOption.value.series[1].symbolSize = calculateSymbolSize();
    chartOption.value.series[2].symbolSize = calculateSymbolSize();
    if (chartRef.value) {
        chartRef.value.resize();
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});



const calculateLegendBottom = () => {
    return window.innerWidth < 1500 ? 10 : 70; 
};

const calculatePaddingTitle = () => {
    return window.innerWidth < 1500 ? [0,0,0,200] : [30,0,0,200];
}

const calculateTitleFontSize = () => {
  return window.innerWidth < 1500 ? 17 : 20
};

const calculateSymbolSize = () => {
    return window.innerWidth < 1500 ? [12.5, 2] : [25, 2.5];
 }

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
    console.log("params.dataIndex", params.dataIndex);
    console.log("selectedBars", selectedBars.value);
    if (params.seriesName === 'Actual GMV' || params.seriesName === 'Average (Expected) GMV') {
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

watch(
    () => variablesStore.offtimes,
    () => {
           selectedBars.value = variablesStore.offtimes
           refreshChart()
           console.log("offtimes: ",variablesStore.offtimes)
           console.log("selectedBars: ", selectedBars)
        
    },
    { immediate: false, deep: true }
);


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
          
            return value > -1 && value < 24 ? `${value}:00` : `` 
        }
    },
    splitLine: {
            show: false,
    //         lineStyle: {
    //             color: '#ccc', 
    //             type: 'dashed' 
    //         }
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
        data: ['Actual GMV','Average (Expected) GMV', 'Min', 'Max'], 
        orient: 'horizontal',
        bottom: calculateLegendBottom(), 
        left: 'center' 
        
    },

    title: {
        text: 'Hourly Comparison',
        textAlign: 'middle',
        textStyle: {
            fontSize: calculateTitleFontSize(),
        },
        padding: calculatePaddingTitle()
    },

    
    
    
    series: [
        { 
            name: 'Average (Expected) GMV', 
            color: 'rgba(237, 200, 100, 0.08)',
            data: [], 
            type: 'bar',
            stack: 'x',
            lineStyle: {
                color: 'red',
                width: 2,
                opacity: 1,
            },
            itemStyle: {
                color: (params) => {
            return selectedBars.value.includes(params.dataIndex) ? 'rgba(245, 50, 20, 0.08)' : 'rgba(237, 200, 100, 0.08)';
        },
                opacity: 1,
                borderWidth: 2.2,
                borderColor: 'rgba(100, 100, 100, 0.2)',
                borderType: 'solid',
            },
            showSymbol: false
        },
        { 
            name: 'Min', 
            data: [], 
            type: 'line',
            symbol: 'rect',
            symbolSize: calculateSymbolSize(),
            lineStyle: {
                width: 0,
            },
            itemStyle: {
                color: 'rgba(100, 100, 100, 0.25)'
            },
            showSymbol: true,
            hoverAnimation: false,
        },
        { 
            name: 'Max', 
            data: [], 
            type: 'line',
            symbol: 'rect',
            symbolSize: calculateSymbolSize(),
            lineStyle: {
                width: 0,
            },
            itemStyle: {
                color: 'rgba(100, 100, 100, 0.25)'
            },
            showSymbol: true,
            hoverAnimation: false,
        },
        { 
            name: 'Actual GMV',
            color: 'rgba(237, 150, 50, 0.5)',
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
            if (selectedBars.value.includes(params.dataIndex)) {
                // Gradient for selected bars
                return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                    {offset: 0, color: 'rgba(232,41,12,0.6)'}, // 0%
                        {offset: 0.25, color: 'rgba(245,50,20,0.6)'}, // 18%
                        {offset: 0.45, color: 'rgba(240,75,50,0.6)'}, // 40%
                        {offset: 0.55, color: 'rgba(240,75,50,0.6)'}, // 60%
                        {offset: 0.75, color: 'rgba(245,50,20,0.6)'}, // 83%
                        {offset: 1, color: 'rgba(232,41,12,0.6)'} // 100%
                    ],
                    global: false
                };
            } else {
                // Gradient for non-selected bars
                return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    //'rgba(237, 150, 50, 0.5)'
                    colorStops: [
                        {offset: 0, color: 'rgba(232,140,12,0.6)'}, // 0%
                        {offset: 0.23, color: 'rgba(237,150,50,0.6)'}, // 23%
                        {offset: 0.47, color: 'rgba(240,175,55,0.6)'}, // 47%
                        {offset: 0.57, color: 'rgba(240,175,55,0.6)'}, // 57%
                        {offset: 0.79, color: 'rgba(237,150,50,0.6)'}, // 79%
                        {offset: 1, color: 'rgba(232,140,12,0.6)'} // 100%
                    ],
                    global: false
                };
            }
        }
    },
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



</style>
