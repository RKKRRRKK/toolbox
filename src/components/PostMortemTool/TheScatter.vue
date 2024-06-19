<template>
    <div class="scatter-container">
        <v-chart ref="chartRef" v-if="isDataLoaded" :option="chartOption2"></v-chart>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted} from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 
import ECharts from 'vue-echarts';
import 'echarts';


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const chartRef = ref(null);

const handleResize = () => {
 
    chartOption2.value.legend.bottom = calculateLegendBottom();
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
    return window.innerWidth < 1500 ? -5 : 70; 
};

const variablesStore = useVariablesStore();
const chartOption2 = ref({
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      return `Date: ${params.data[2]}<br/>GMV: ${numberWithCommas(params.data[1])} €`;
    }
  },
  grid: {
    left: '5%',  
    right: '20%',
    top: '7%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
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
      formatter: (value) => numberWithCommas(value / 1000000) + 'M €'
    },
    max:  function (value) {
    var roundtomil = Math.ceil(value.max / 500000) * 500000;
    return roundtomil
},
    min: function (value) {
    var roundtomil = Math.floor(value.min / 500000) * 500000;
    return roundtomil
},
    interval: 500000,
    splitLine: {
            show: true,
            lineStyle: {
                color: '#ccc', 
                type: 'dashed' 
            }
        }
  },

  legend: {
        data: ['Comparison Days', 'Outtage Day', 'Outtage Day + Loss'], 
        orient: 'horizontal',
        bottom: calculateLegendBottom(), 
        left: 'center' 
        
    },

  title: {
        text: 'Overview',
        textAlign: 'midlde',
        textStyle: {
            fontSize: 20,
        },

        padding: [
    0,  // up
    0, // right
    0,  // down
    65, // left
],

    },
  series: [
    {
      name: 'Comparison Days',
      data: [],
      type: 'scatter',
      symbolSize: 40,

      itemStyle: {
                color: 'rgba(204, 204, 204, 0.8)',
            },
    markLine: {
        label: {
           show: true,
           formatter: function (params) {
            // Accessing the value from params object and converting it
            return (params.value / 1000000).toFixed(2) + 'M € \nAverage'
        },
        opacity: 0.8

        },
        tooltip: {
            show: true, //tooltip for the markLine
            formatter: 'Average' //text for the tooltip
        },
        lineStyle: {
            color: 'black',
            type: 'line',
            width: 1.5,
            opacity: 0.5
        },
        symbol: ['none', 'none'],
        data: [
            { type: 'average', name: 'Average' }
        ]
    }
}
,
{
  name: 'Outtage Day',
  data: [], 
  type: 'scatter',
  symbolSize: 40,
  itemStyle: {
    color: 'rgba(237, 150, 50, 0.8)',
  },
  markPoint: {
    data: [
      {
        coord: [],
        label: {
          formatter: function (params) {
         
            return params.value[2];
          },
          position: 'top'
        }
      }
    ]
  }
}
,
{
  name: 'Outtage Day + Loss',
  data: [], 
  type: 'scatter',
  symbolSize: 40,
  itemStyle: {
    color: 'rgba(237, 150, 50, 0.1)',
    borderColor: 'rgba(237, 150, 50, 0.8)',
    borderType: 'dashed',
    borderWidth: 2
  },
  markPoint: {
    data: [
      {
        coord: [],
        label: {
          formatter: function (params) {
         
            return params.value[2];
          },
          position: 'top'
        }
      }
    ]
  }
}
,
{
        data: [], 
        type: 'line',
        itemStyle: {
            color: 'rgba(30, 144, 255, 0.8)',  
        },
        smooth: true, 
    }
,
  ]

});

const isDataLoaded = ref(false);

function parseJSON(jsonStr) {
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Failed to parse JSON:', jsonStr, e);
        return [];
    }
}

function parseDates(datesStr) {
    try {
     
        const correctedDatesStr = datesStr.replace(/\d{4}-\d{2}-\d{2}/g, match => `"${match}"`);
        return JSON.parse(correctedDatesStr);
    } catch (e) {
        console.error('Failed to parse dates:', datesStr, e);
        return [];
    }
}

function sumArrays(arrayOfArrays) {
    if (!arrayOfArrays.length) return [];
    return arrayOfArrays.reduce((accumulator, currentArray) => 
        accumulator.map((sum, index) => sum + currentArray[index]), 
        Array(arrayOfArrays[0].length).fill(0)
    );
}


watch(
    [() => variablesStore.data, () => variablesStore.start, () => variablesStore.loss], 
    ([newData, newStart, newLoss], [oldData, oldStart]) => {
        if (newData && newData.array_gmv && newData.array_order && newData.array_date) {
            const gmvArrays = newData.array_gmv.map(parseJSON);
            const summedGMV = sumArrays(gmvArrays);
            variablesStore.setSummedGMV(summedGMV);
            console.log("set summed gmv", summedGMV);

            const orders = parseJSON(newData.array_order[0]);
            const dates = parseDates(newData.array_date[0]);
            const currentDate = newStart ? newStart : 'Date Not Selected';
            console.log("start date", newStart);
            const currentGMV = Math.round(variablesStore.data.on_total_gmv[1]);

            const index = summedGMV.length + 1;
            console.log(index);

            if (orders && dates && summedGMV.length > 0) {
                const seriesData = orders.map((order, index) => [order, summedGMV[index], dates[index]]);
                console.log("seriesData", seriesData);
                console.log("my series data", [index, currentGMV, currentDate]);
                console.log("total gmv plus loss: ", currentGMV, " + ", (-1 * Math.round(newLoss)))
                let totalGMVPlusLoss = currentGMV + (-1 * Math.round(newLoss))
                chartOption2.value.series[0].data = seriesData;
                chartOption2.value.series[1].data = [[index, currentGMV, currentDate]];
                chartOption2.value.series[2].data = [[index, totalGMVPlusLoss, currentDate]];
                isDataLoaded.value = true;
                console.log("updating isdataloaded value at TheScatter.vue", isDataLoaded);
                chartOption2.value.xAxis.max = Math.max(...seriesData.map(item => item[0])) + 2;
            } else {
                console.error('missing data at TheScatter');
            }
        }
    }, 
    { immediate: true, deep: true }
);


</script>

<style>

</style>
