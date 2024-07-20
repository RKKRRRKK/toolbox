<template>
    <div>
        <v-chart ref="chartRef" class="chart" v-if="isDataLoaded" :option="chartOption"></v-chart>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/TheDashboard/data.js'; 
import 'echarts';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const dashboardStore = useDashboardStore();
const selectedPaymentMethod = computed(() => dashboardStore.selectedPaymentMethod);
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
        max: function (value) {
            return Math.round(value.max);
        }
    },
    grid: {
        left: '0%',  
        right: '5%',
        top: '1%',
        bottom: '0%',
        containLabel: true,
    },
    legend: {
        show: false,
        data: [],
        orient: 'vertical',
        left: 'right',
        selected: {}
    },
    series: [],
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            const realValue = numberWithCommas(Math.round(params.data * totalValues.value[params.dataIndex] / 100)) + '€';
            const percentage = params.data.toFixed(2);
            return `<strong style="font-size: 18px;">${params.seriesName}</strong> <br><br> <b>Real GMV:</b> ${realValue}  <br> <b>Share of Daily Total:</b> ${percentage}% 
            <br> <i>(Scale of bars depends on %)</i>`;
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
                    } else {
                        return "";
                    }
                }
            },
            itemStyle: {
                color: (params) => {
                    if (params.dataIndex === dates.length - 1) {
                        return redShades[methodIndex % redShades.length];
                    } else {
                        return grayShades[methodIndex % grayShades.length];
                    }
                }
            }
        };
    });

    chartOption.value.series = series;

    // Deselect all except "klarna_opf"
    deselectAllExcept(selectedPaymentMethod);
};

const deselectAllExcept = (methodToKeep) => {
    const selected = {};
    if (methodToKeep.value) {
        // Only keep the selected method if it exists
        chartOption.value.legend.data.forEach(method => {
            selected[method] = method === methodToKeep.value;
        });
    } else {
        // If no method is selected, ensure all methods are selected
        chartOption.value.legend.data.forEach(method => {
            selected[method] = true;
        });
    }
    chartOption.value.legend.selected = selected;
};
watch(selectedPaymentMethod, () => {
    if (dashboardStore.hm_live.date.length) {
        processData(dashboardStore.hm_live);
    }
}, { immediate: true });

onMounted(() => {
    if (dashboardStore.hm_live.date.length) {
        processData(dashboardStore.hm_live);
        isDataLoaded.value = true;
    }
});
</script>

<style>
</style>