<template>
    <div class="scatter-container">
        <v-chart v-if="isDataLoaded" :option="chartOption2" style="height: 650px;"></v-chart>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 
import ECharts from 'vue-echarts';
import 'echarts';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
    bottom: '8%',
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
    return roundtomil + 500000;
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
        data: ['Comparison Days', 'Outtage Day'], 
        orient: 'horizontal',
        bottom: 10, 
        left: 'center' 
        
    },

  title: {
        text: 'Overview of Considered Dates',
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
            show: true, // Enabling tooltip for the markLine
            formatter: 'Average' // Static text for the tooltip
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

watch(() => variablesStore, (newData) => {
    if (newData && newData.data.array_gmv && newData.data.array_order && newData.data.array_date) {
        const gmvArrays = newData.data.array_gmv.map(parseJSON);
        const summedGMV = sumArrays(gmvArrays);

        const orders = parseJSON(newData.data.array_order[0]);
        const dates = parseDates(newData.data.array_date[0]);
        const currentDate = newData.start ? newData.start : 'Date Not Selected'
        console.log("start date", newData.start)
        const currentGMV = Math.round(variablesStore.data.gmv_part[1] * 100)
        const index = summedGMV.length + 1 
        console.log(index)

        if (orders && dates && summedGMV.length > 0) {
            const seriesData = orders.map((order, index) => [order, summedGMV[index], dates[index]]);
            console.log("seriesData", seriesData)
            console.log("my series data", [index, currentGMV, currentDate])
            chartOption2.value.series[0].data = seriesData;
            chartOption2.value.series[1].data = [[index, currentGMV, currentDate]]
            isDataLoaded.value = true;
            console.log("updating isdataloaded value at TheScatter.vue", isDataLoaded);
            chartOption2.value.xAxis.max = Math.max(...seriesData.map(item => item[0])) + 2;
        } else {
            console.error('missing data at TheScatter');
        }
    }
}, { immediate: true, deep: true });

</script>

<style>
.scatter-container {
    padding-top: 2rem;
}
</style>
