<template>
    <div>
        <select v-model="selectedPaymentMethod">
            <option value="">All</option>
            <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
        </select>
        <v-chart ref="chartRef" class="chart" v-if="isDataLoaded" :option="chartOption"></v-chart>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/TheDashboard/data.js'; 
import 'echarts';

const dashboardStore = useDashboardStore();

const chartRef = ref(null);
const chartOption = ref({
    xAxis: {
        type: 'category',
        data: [],
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

    series: [],
});

const isDataLoaded = ref(false);
const selectedPaymentMethod = ref('');
const paymentMethods = ref([]);


const processData = (data) => {
    const hours = [...new Set(data.hour)];
    const dates = [...new Set(data.date)];
    paymentMethods.value = [...new Set(data.payment_provider_method)];

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
};

watch(() => dashboardStore.hm_live, (newData) => {
    if (newData && newData.date.length) {
        processData(newData);
        isDataLoaded.value = true;
    }
}, { immediate: true, deep: true });

watch(selectedPaymentMethod, () => {
    if (dashboardStore.hm_live.date.length) {
        processData(dashboardStore.hm_live);
    }
});

onMounted(() => {
    if (dashboardStore.hm_live.date.length) {
        processData(dashboardStore.hm_live);
        isDataLoaded.value = true;
    }
});
</script>

<style>

</style>