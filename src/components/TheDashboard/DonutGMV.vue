<template>
    <div>
      <v-chart ref="chartRef" v-if="isDataLoaded" :option="chartOption"></v-chart>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { useDashboardStore } from '@/stores/TheDashboard/data.js'; // Adjust this import path as needed
  import 'echarts';
  
  const dashboardStore = useDashboardStore();
  const chartRef = ref(null);
  const isDataLoaded = ref(false);
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



  const chartOption = ref({
 
    title: {
        text: 'GMV',
        left: 'center'
    },



    series: [
      {
        name: 'GMV Composition',
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
            return `${params.name} \n ${(params.value / 1000000).toFixed(2)} million`;
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
    const selectedPaymentMethod = dashboardStore.selectedPaymentMethod;
    const data = dashboardStore.hm_live;
    let totalGMV = 0;
    let totalProvision = 0;
  
    // Filter data based on selected criteria
    data.date.forEach((date, index) => {
      const isDateMatch = selectedDate ? date === selectedDate : true;
      const isPaymentMethodMatch = selectedPaymentMethod ? data.payment_provider_method[index] === selectedPaymentMethod : true;
  
      if (isDateMatch && isPaymentMethodMatch) {
        totalGMV += data.gmv[index];
        totalProvision += data.provision[index];
      }
    });
  
    chartOption.value.series[0].data = [
      { value: totalGMV, name: 'GMV' },
      { value: totalProvision, name: 'Provision' }
    ];
    isDataLoaded.value = true;
  };

  watch(() => dashboardStore.hm_live, (newData) => {
    if (newData && newData.date.length) {
        updateDonutChart(newData);
    }
}, { immediate: true, deep: true });
  
  watch(() => [dashboardStore.selectedDate, dashboardStore.selectedPaymentMethod], () => {
    if (dashboardStore.hm_live.date.length) {
      updateDonutChart();
    }
  }, { immediate: true, deep: true });
  
  onMounted(() => {
    if (dashboardStore.hm_live.date.length) {
      updateDonutChart();
    }
  });
  </script>
  
  <style scoped>

  </style>
  