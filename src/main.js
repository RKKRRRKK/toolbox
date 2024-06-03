import 'material-icons/iconfont/material-icons.css';
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'
import ECharts from 'vue-echarts'; // Import ECharts component
import 'echarts'; // Import ECharts library

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.component('v-chart', ECharts);

app.mount('#app')
