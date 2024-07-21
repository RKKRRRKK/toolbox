<template>
    <div>
      <v-chart ref="chartRef" class="chart" v-if="isDataLoaded" :option="chartOption"></v-chart>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { useDashboardStore } from '@/stores/TheDashboard/data.js'; // Adjust this import path as needed
  import 'echarts';
  
  const dashboardStore = useDashboardStore();
  const chartRef = ref(null);
  const isDataLoaded = ref(false);
  
  // Define a color map for browsers
  const browserColors = {
    Chrome: '#4285F4', // Blue, Google's Chrome color
    Firefox: '#FF7139', // Fiery Orange, Firefox brand color
    Edge: '#0078D7', // Microsoft's blue for Edge
    Safari: '#00A9E0', // Lighter blue, distinct from Edge
    Opera: '#FF1B2D', // Red, Opera's brand color
    'Samsung Internet': '#1428A0', // Dark blue, Samsung's brand color
    'Safari (in-app)': '#A3CEF1', // Lighter shade of Safari blue
    'Android Webview': '#3DDC84', // Green, Android brand color
    Other: '#D3D3D3' // Gray for unspecified browsers
};
  
  const chartOption = ref({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Browser Usage',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: []
      }
    ]
  });
  
  const updateDonutChart = () => {
    const selectedDate = dashboardStore.selectedDate;
    const data = dashboardStore.ga4;
    const browserCounts = {};
  
    data.date.forEach((date, index) => {
      if (!selectedDate || date === selectedDate) {
        const browser = data.browser[index];
        const sidCount = data.sid_count[index];
        if (browserCounts[browser]) {
          browserCounts[browser] += sidCount;
        } else {
          browserCounts[browser] = sidCount;
        }
      }
    });
  
    chartOption.value.series[0].data = Object.keys(browserCounts).map(browser => ({
      value: browserCounts[browser],
      name: browser,
      itemStyle: {
        color: browserColors[browser] || browserColors['Other'] // Default color for unspecified browsers
      }
    }));
  
    isDataLoaded.value = true;
  };
  
  watch(() => dashboardStore.selectedDate, () => {
    if (dashboardStore.ga4.date.length) {
      updateDonutChart();
    }
  }, { immediate: true });
  
  onMounted(() => {
    if (dashboardStore.ga4.date.length) {
      updateDonutChart();
    }
  });
  </script>
  
  <style scoped>
  .chart {
    width: 100%;
    height: 500px; /* Adjust size as needed */
  }
  </style>
  