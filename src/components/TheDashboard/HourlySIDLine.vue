<template>
    <div>
        <v-chart ref="chartRef"  v-if="isDataLoaded" :option="chartOption"></v-chart>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/TheDashboard/data.js'; // Adjust this import path as needed
import 'echarts';

const dashboardStore = useDashboardStore();
const chartRef = ref(null);
const isDataLoaded = ref(false);

const chartOption = ref({
    xAxis: {
        type: 'category',
        data: [],
        axisTick: {
            show: false,
        },
        axisLabel: {
            interval: 0
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
        left: 'right',
        top: '5%' 
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            return params.map(param => {
                const realValue = numberWithCommas(param.data);
                return `${param.marker} ${param.seriesName}: ${realValue}`;
            }).join('<br>');
        }
    },
    series: [],
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const processData = (data) => {
    const hours = [...new Set(data.hour)];
    chartOption.value.xAxis.data = hours;

    const dates = [...new Set(data.date)].sort();
    chartOption.value.legend.data = dates;

    const series = dates.map((date, index) => {
        const dataPoints = hours.map(hour => {
            const indices = data.hour.reduce((acc, h, index) => {
                if (h === hour && data.date[index] === date) {
                    acc.push(index);
                }
                return acc;
            }, []);
            const sidCounts = indices.map(index => data.sid_count[index]);
            return sidCounts.reduce((a, b) => a + b, 0); // Sum up all sid_counts for the hour
        });
        return {
            name: date,
            type: 'line',
            data: dataPoints,
            smooth: false,
            lineStyle: {
                width: 4,
                color: index === dates.length - 1 ? '#e74c3c' : '#bdc3c7' // Last date in red, others in light gray
            },
            showSymbol: false,
            symbolSize: 6
        };
    });

    chartOption.value.series = series;
    isDataLoaded.value = true; // Set true after processing
};

watch(() => dashboardStore.ga4, (newData) => {
    if (newData && newData.hour.length && newData.date.length) {
        processData(newData);
    }
}, { immediate: true, deep: true });

onMounted(() => {
    if (dashboardStore.ga4.hour.length && dashboardStore.ga4.date.length) {
        processData(dashboardStore.ga4);
    }
});
</script>

<style scoped>

</style>