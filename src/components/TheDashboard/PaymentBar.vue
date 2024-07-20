<template>
    <div>
        <v-chart ref="chartRef" class="chart" v-if="isDataLoaded" :option="chartOption"></v-chart>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/TheDashboard/data.js'; 
import 'echarts';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


const dashboardStore = useDashboardStore();

const chartRef = ref(null);
const chartOption = ref({
    xAxis: {
        type: 'category',
        data: [],
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value}%'
        },
        max: 100
    },
    grid: {
        left: '0%',  
        right: '5%',
        top: '1%',
        bottom: '0%',
        containLabel: true,
    },
    legend: {
        data: [],
        orient: 'vertical',
        left: 'right' 
    },
    series: [],
    tooltip: {
        trigger: 'item', // Change trigger to 'item'
        formatter: function (params) {
            const realValue = numberWithCommas(Math.round(params.data * totalValues.value[params.dataIndex] / 100)); // Convert back to real value
            const percentage = params.data.toFixed(2);
                return `${params.seriesName}: ${realValue} (${percentage}%)`;
        
            }
            }
});


const isDataLoaded = ref(false);
const totalValues = ref([]);

const processData = (data) => {
    const dates = [...new Set(data.date)];
    const paymentMethods = [...new Set(data.payment_provider_method)];

    chartOption.value.xAxis.data = dates;
    chartOption.value.legend.data = paymentMethods;

    const redShades = [
        '#FFCCCC', '#FF9999', '#FF6666', '#FF3333', '#FF0000', 
        '#CC0000', '#990000', '#660000', '#330000', '#000000'
    ];

    const grayShades = [
        '#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', 
        '#616161', '#424242', '#212121', '#000000'
    ];

    // Calculate total GMV for each date
    totalValues.value = dates.map(date => {
        return data.gmv.reduce((sum, gmv, index) => {
            return data.date[index] === date ? sum + gmv : sum;
        }, 0);
    });

    const series = paymentMethods.map((method, methodIndex) => {
        const methodData = dates.map((date, dateIndex) => {
            const gmv = data.gmv.filter((_, i) => 
                data.date[i] === date && data.payment_provider_method[i] === method
            );
            const realValue = gmv.length ? gmv.reduce((a, b) => a + b, 0) : 0;
            return totalValues.value[dateIndex] ? (realValue / totalValues.value[dateIndex]) * 100 : 0;
        });

        return {
            name: method,
            type: 'bar',
            stack: 'total',
            data: methodData,
            label: {
                show: true,
                position: 'inside',
                formatter: function (params) {
                    const realValue = methodData[params.dataIndex] * totalValues.value[params.dataIndex] / 100;
                    const percentage = methodData[params.dataIndex].toFixed(2);
                    if (percentage > 4) {
                    return `${params.seriesName} (${percentage}%)`;
                    }
                    else return ""
                }
            },
            itemStyle: {
                color: (params) => {
                    if (params.dataIndex === dates.length - 1) {
                        return redShades[methodIndex % redShades.length]; // Distinct shades of red for the last date
                    } else {
                        return grayShades[methodIndex % grayShades.length]; // Distinct shades of gray for other dates
                    }
                }
            }
        };
    });

    chartOption.value.series = series;
};

watch(() => dashboardStore.hm_live, (newData) => {
    if (newData && newData.date.length) {
        processData(newData);
        isDataLoaded.value = true;
    }
}, { immediate: true, deep: true });

onMounted(() => {
    if (dashboardStore.hm_live.date.length) {
        processData(dashboardStore.hm_live);
        isDataLoaded.value = true;
    }
});
</script>

<style>

</style>