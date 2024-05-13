<template>
    <div>
        <div class="slider-container">
            <TheSlider class="slider" v-if="isDataLoaded"></TheSlider>
        </div>
        <v-chart class="chart" v-if="isDataLoaded" :option="chartOption" @legendselectchanged="timeframeToggle($event)"></v-chart>
    </div>
</template>

<script setup>
import TheSlider from "../PostMortemTool/TheSlider.vue"
import { ref, resolveDirective, watch } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 
import ECharts from 'vue-echarts';
import 'echarts';

const variablesStore = useVariablesStore();

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

function mapNormalizedToReal(index) {
    // This assumes 'actual_gmv_euros' is loaded and has the same length as the normalized 'actual_gmv'
    if (variablesStore.data && variablesStore.data.actual_gmv_euros) {
        return variablesStore.data.actual_gmv_euros[index];
    }
    return null;
}

function mapNormalizedToRealAvg(index) {
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
          
            return value < 10 ? `0${value}:00` : `${value}:00`;
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
                const factor = variablesStore.data && variablesStore.data.gmv_part ? variablesStore.data.gmv_part[1] : 1;
                return `${numberWithCommas(Math.round(value * factor))} €`;
            }
        },
        interval: 1,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#ccc', 
                type: 'dashed' 
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

    grid: {
    left: '2%',  
    right: '2%',
    top: '7%',
    bottom: '8%',
    containLabel: true
  },



    legend: {
        data: ['Average (Expected) GMV', 'Min', 'Max', 'Actual GMV', 'Affected Timeframe'], 
        orient: 'horizontal',
        bottom: 10, 
        left: 'center' 
        
    },

    title: {
        text: 'Hourly Comparison (normalized)',
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
            type: 'line',
            lineStyle: {
                color: 'black',
                width: 2,
                opacity: 0.5,
            },
            itemStyle: {
                color: 'black',
                opacity: 0.5,
            },
            showSymbol: false
        },
        { 
            name: 'Min', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'black',
                width: 6,
                type: 'dotted',
                opacity: 0.08
            },
            
            itemStyle: {
                color: 'black',
                opacity: 0.1,
            },
            showSymbol: false
        },
        { 
            name: 'Max', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'black',
                width:  6,
                type: 'dotted',
                opacity: 0.08
            },
            itemStyle: {
                color: 'black',
                opacity: 0.1,
            },
            
            showSymbol: false
        },
        { 
            name: 'Actual GMV', 
            data: [], 
            type: 'line',
            lineStyle: {
                color: 'rgba(237, 150, 50, 1)',
                width: 3.5
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
                 
                    width: 1.5
                },
                label: {
        show: false 
    }
            },
      markArea: {
        silent: true,
        itemStyle: {
                   
                },
        data: []  
      },
      tooltip: {
        show: false
      },
      itemStyle: {
                color: 'green',
                opacity: 1,
            },
    }
  ],
});

const isDataLoaded = ref(false);


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
        updateMarkLine();  
        if (newData.actual_gmv) {
            isDataLoaded.value = true;
        }
        console.log("updating is loaded value", isDataLoaded.value)
    }
}, { immediate: true, deep: true });



watch(() => [variablesStore.ontime, variablesStore.offtime], updateMarkLine, { immediate: true, deep: true });

function updateColorStyles() {
    const markColor = variablesStore.isNegative ? 'rgba(200, 0, 0, 0.4)' : 'rgba(0, 150, 0, 0.8)';
    const areaColor = variablesStore.isNegative ? 'rgba(150, 0, 0, 0.05)' : 'rgba(0, 150, 0, 0.05)';

    // Update markLine and markArea styles
    chartOption.value.series[4].markLine.lineStyle.color = markColor;
    chartOption.value.series[4].markArea.itemStyle.color = areaColor;
}

    watch(() => variablesStore.isNegative, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        updateColorStyles();
    }
}, { immediate: true });

updateColorStyles();



</script>


<style>

.slider-container {
    display: flex;
    justify-content: center;
    padding-left: 4rem;  
}


.slider {
    width: 100%; 
    transform: translateY(3rem);
}


</style>
