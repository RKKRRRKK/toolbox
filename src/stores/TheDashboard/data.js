import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        hm_live: {
            hour: [],
            date: [],
            gmv: [],
            payment_provider_method: [],
            holiday: [],
            platform: []
        },
        ga4: {
            sid_count: [],
            category: [],
            operating_system: [],
            browser: [],
            date: [],
            hour: []
        }
    }),
    actions: {
        setCSV0Data(data) {
          console.log("csv0 set with: ", data)
            this.hm_live = data;
      
        },
        setCSV1Data(data) {
          console.log("csv1 set with: ", data)
            this.ga4 = data;
         
        }
    }
})