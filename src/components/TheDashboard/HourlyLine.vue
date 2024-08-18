<template>
    <div>
        <v-chart ref="chartRef"  v-if="isDataLoaded" :option="chartOption"></v-chart>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/TheDashboard/data.js';
import 'echarts';

const dashboardStore = useDashboardStore();
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const chartRef = ref(null);
const chartOption = ref({
    xAxis: {
        type: 'category',
        data: [],
axisTick: {
   show: false,
   
},
axisLabel: {
    interval: 1
}
    },
    yAxis: {
        type: 'value',
    },
    grid: {
        left: '2%',  
        right: '2%',
        top: '7%',
        bottom: '3%',
        containLabel: true
    },
    legend: {
        data: [],
        orient: 'vertical',
        left:'10%',
        top: '5%' 
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            return params.map(param => {
                const realValue = numberWithCommas(Math.round(param.data));
                return `${param.marker} ${param.seriesName}: ${realValue}`;
            }).join('<br>');
        }
    },
    series: [],
});

const isDataLoaded = ref(false);
// Use computed for reactive update
const selectedPaymentMethod = computed(() => dashboardStore.selectedPaymentMethod);

const processData = (data) => {
    const hours = [...new Set(data.hour)];
    const dates = [...new Set(data.date)];
    chartOption.value.xAxis.data = hours;
    chartOption.value.legend.data = dates;

    const series = dates.map((date, index) => ({
        name: date,
        type: 'line',
        data: hours.map(hour => {
            const gmv = data.gmv.filter((_, i) => 
                data.date[i] === date && data.hour[i] === hour && 
                (selectedPaymentMethod.value === '' || data.payment_provider_method[i] === selectedPaymentMethod.value)
            );
            return gmv.length ? gmv.reduce((a, b) => a + b, 0) : 0;
        }),
        lineStyle: {
            width: 4, // Make the lines thicker
            color: index === dates.length - 1 ? '#e74c3c' : '#bdc3c7' // Last date red, others light gray
        },
        itemStyle: {
            borderWidth: 0 // Remove markers
        },
        showSymbol: false // Remove markers
    }));

    chartOption.value.series = series;
    console.log("HOURLY LINE between chartoption setting and dataloaded true ")
    isDataLoaded.value = true; // Set true after processing
};

watch(() => dashboardStore.hm_live, (newData) => {
    if (newData && newData.date.length) {
        processData(newData);
    }
}, { immediate: true, deep: true });

watch(selectedPaymentMethod, () => {
    if (dashboardStore.hm_live.date.length) {
        processData(dashboardStore.hm_live);
    }
}, { immediate: true });

onMounted(() => {
    if (dashboardStore.hm_live.date.length) {
        processData(dashboardStore.hm_live);
    }
});
</script>

<style>

</style>