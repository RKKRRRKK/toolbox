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

  
  // Define a color map for categorys
  const categoryColors = {
    desktop: '#4285F4', // Blue, Google's Chrome color
    mobile: '#FF7139', // Fiery Orange, Firefox brand color
    tablet: '#0078D7', // Microsoft's blue for Edge
    Other: '#D3D3D3' // Gray for unspecified categorys
};
  
const chartOption = ref({


  title: {
        text: 'Device',
        left: 'center'
    },

 
  series: [
    {
      name: 'category Usage',
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
  const categoryCounts = {};

  // Create an array to hold the category data with their corresponding sidCount
  const categoryData = [];

  // Iterate over the data and collect category and sidCount information
  data.date.forEach((date, index) => {
    if (!selectedDate || date === selectedDate) {
      const category = data.category[index];
      const sidCount = data.sid_count[index];
      // Add the category and sidCount to the array
      categoryData.push({ category, sidCount });
    }
  });

  // Sort the array in descending order of sidCount
  categoryData.sort((a, b) => b.sidCount - a.sidCount);

  // Aggregate the sidCount for each category
  categoryData.forEach(({ category, sidCount }) => {
    if (categoryCounts[category]) {
      categoryCounts[category] += sidCount;
    } else {
      categoryCounts[category] = sidCount;
    }
  });

  chartOption.value.series[0].data = Object.keys(categoryCounts).map(category => ({
    value: categoryCounts[category],
    name: category,
    itemStyle: {
      color: categoryColors[category] || categoryColors['Other'] // Default color for unspecified categorys
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
  