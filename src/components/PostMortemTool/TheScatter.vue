<template>
        <div>
        <v-chart v-if="isDataLoaded" :option="chartOption2" style="height: 550px;"></v-chart>
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

const chartOption2 = ref({
  xAxis: {},
  yAxis: {},
  series: [
    {
      symbolSize: 20,
      data: [
        [0, 7],
        [1, 6.95],
        [2, 7.58],
        [3, 8.81]
      ],
      type: 'scatter'
    }
  ]
});

const isDataLoaded = ref(false);


watch(() => variablesStore.data, (newData) => {
    if (newData) {
        isDataLoaded.value = true;
    }
}, { immediate: true, deep: true });

</script>


<style>
</style>