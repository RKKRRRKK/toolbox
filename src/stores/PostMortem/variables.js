import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useVariablesStore = defineStore('variables', {
  state: () => ({
    start: '',
    end: '',
    offtime: '',
    ontime: '',
    storefront: 'DE',
    platform: "'web'",
    SQL: '',
    data:{},
    isNegative: true,
    timeframeToggle: true,
    model: 'normalized',
    summedGMV: [],  
    processedData: {},
    extraGMV:0,
    loss:0,
    darkMode: false,
    offtimes: [],
    
  }),
  actions: {
    setstarttime(value) {
      this.start = value
    },
    setendtime(value) {
      this.end = value
      console.log("typeof check ontime", typeof(value))
    },
    setstorefront(value) {
      this.storefront = value
    },
    setplatform(value) {
      this.platform = value
    },
    setModel(value) {
      this.model = value
    },

    setSQL(value) {
      this.SQL = value
      console.log("setSQL went through with", value)
    },
    
    setData(data) {
      this.data = data
      console.log("data set with", data)
      //   let loss = data.avg_loss
      //   console.log("loss is", loss)
      //   let iter_sum = 0
      //   let iter_pos = 0
      //   for (let i = 0; i < loss.length -1; i++) {
      //       let current_sum = loss[i] + loss[i+1] 
      //       if (current_sum > iter_sum) {
      //           iter_sum = current_sum
      //           iter_pos = i
      //       }
      //   }
      //   this.offtime = iter_pos 
      //   this.ontime = iter_pos + 1
      // console.log("starting position set with", iter_pos, iter_pos +1)
        
    },

    setofftime(value) {
      this.offtime = value
    },

    setontime(value) {
      console.log("does setontime trigger?")
      this.ontime = value
      console.log("typeof check ontime", typeof(value))
    },

    setNegative(value) {
      this.isNegative = value;
    },

    setTimeframe(isSelected) {
      this.timeframeToggle = isSelected
    },

    setSummedGMV(value) {
      this.summedGMV = value
      console.log("gmv value pushed", value)
    },

    setProcessedData(value) {
      this.processedData = value
    },

    setStartingPosition(loss) {
        // console.log("loss is", loss)
        let iter_loss = 0
        let iter_pos = 0
        for (let i = 0; i < loss.length -1; i++) {
            let current_loss = loss[i]
            if (current_loss > iter_loss) {
                iter_loss = current_loss
                iter_pos = i
            }
        }
        if (this.offtimes !== iter_pos) {
        console.log("offtimes set with: ", iter_pos)
        this.offtimes.push(iter_pos)
        }
    },

    setExtraGmv(value) {
      this.extraGMV = value
    },

    waitForProcessedData() {
      return new Promise((resolve) => {
          const unwatch = watch(() => this.processedData, (newData) => {
              if (newData) { 
                  unwatch();
                  resolve();
              }
          }, { immediate: false });
      });
  },

  setLoss(loss) {
  this.loss = loss
  console.log('loss set as: ', loss)
  },

  setDarkMode(value) {
    this.darkMode = value
    console.log("darkmode triggered in variables.js", value)
  },

  setOfftimes(value) {
    this.offtimes = value
    console.log('offtimes set with', value)
  }


  }
});