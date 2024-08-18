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
  const totalValue = ref(0);  // This ref will store the total value to be used for percentage calculations

const calculateTotal = () => {
  totalValue.value = chartOption.value.series[0].data.reduce((sum, item) => sum + item.value, 0);
};

  
  // Define a color map for operating_systems
  const operating_systemColors = {
    iOS: '#4285F4', // Blue, Google's Chrome color
    Windows: '#FF7139', // Fiery Orange, Firefox brand color
    Android: '#0078D7', // Microsoft's blue for Edge
    Macintosh: '#00A9E0', // Lighter blue, distinct from Edge
    Linux: '#FF1B2D', // Red, Opera's brand color
    Other: '#D3D3D3' // Gray for unspecified operating_systems
};
  
const chartOption = ref({

  title: {
        text: 'Operating System',
        left: 'center'
    },

 
  series: [
    {
      name: 'operating_system Usage',
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
          fontSize: '15',
          fontWeight: 'bold',
          formatter: function(params) {
            // Using the calculated total to compute the percentage
            var percent = ((params.value / totalValue.value) * 100).toFixed(2);
            return `${params.name} \n ${percent}%`;
          }
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
  const operating_systemCounts = {};

  // Create an array to hold the operating_system data with their corresponding sidCount
  const operating_systemData = [];

  // Iterate over the data and collect operating_system and sidCount information
  data.date.forEach((date, index) => {
    if (!selectedDate || date === selectedDate) {
      const operating_system = data.operating_system[index];
      const sidCount = data.sid_count[index];
      // Add the operating_system and sidCount to the array
      operating_systemData.push({ operating_system, sidCount });
    }
  });

  // Sort the array in descending order of sidCount
  operating_systemData.sort((a, b) => b.sidCount - a.sidCount);

  // Aggregate the sidCount for each operating_system
  operating_systemData.forEach(({ operating_system, sidCount }) => {
    if (operating_systemCounts[operating_system]) {
      operating_systemCounts[operating_system] += sidCount;
    } else {
      operating_systemCounts[operating_system] = sidCount;
    }
  });

  chartOption.value.series[0].data = Object.keys(operating_systemCounts).map(operating_system => ({
    value: operating_systemCounts[operating_system],
    name: operating_system,
    itemStyle: {
      color: operating_systemColors[operating_system] || operating_systemColors['Other'] // Default color for unspecified operating_systems
    }
  }));
  calculateTotal();
  isDataLoaded.value = true;
};

watch(() => dashboardStore.ga4, (newData) => {
    if (newData && newData.date.length) {
        updateDonutChart(newData);
    }
}, { immediate: true, deep: true });
  
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

  </style>
  