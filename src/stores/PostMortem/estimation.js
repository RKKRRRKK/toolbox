import { defineStore } from 'pinia'
import { watch } from 'vue'
import { useVariablesStore } from '@/stores/PostMortem/variables'

export const useEstimationStore = defineStore('estimationStore', {
  state: () => ({
    variablesStore: useVariablesStore(),
    result: null,
    lastUpdate: null,
  }),
  getters: {
    actualgmv: (state) => state.variablesStore.processedData.on_h_gmv,
    averagegmv: (state) => state.variablesStore.processedData.off_havg_gmv
  },
  actions: {

    createArray(start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    },
    updateEstimations(from, to) {
        console.log("this.actualgmv", this.actualgmv)
        const actualOutsideRange = [...this.actualgmv.slice(0, from), ...this.actualgmv.slice(to + 1)];
        const predictionOutsideRange = [...this.averagegmv.slice(0, from), ...this.averagegmv.slice(to + 1)];
        const totalPrediction = this.averagegmv.reduce((acc, curr) => acc + curr, 0);
        const actualOutsideRangeTotal = actualOutsideRange.reduce((acc,curr) =>  acc + curr, 0);
        // console.log("actualOutsideRange", actualOutsideRange)
     
      
      const relativeValuesPrediction = []
      for (let i =0; i < this.averagegmv.length; i ++) {
       relativeValuesPrediction.push(this.averagegmv[i] / totalPrediction)
      }
      
      const fromto = this.createArray(from, to)
      const relativePredictedInsideRange = []
      const ActualInsideRange = []
      let ActualInsideRangeSum = 0
      
    for (let i = 0; i < this.averagegmv.length; i++) {
            if (fromto.includes(i)) {
                relativePredictedInsideRange.push(relativeValuesPrediction[i]);
                ActualInsideRange.push(this.actualgmv[i]);
                ActualInsideRangeSum = ActualInsideRangeSum + this.actualgmv[i]
            }
        }
      
      const relativePredictedInsideRangeTotal = relativePredictedInsideRange.reduce((acc,curr) => acc + curr,0);
      const predictedTotalMinusInsideRelative =  1 - relativePredictedInsideRangeTotal
      const actualTotal =  (actualOutsideRangeTotal / (predictedTotalMinusInsideRelative * 100)) * 100
      const outtageActualPredicted = []
      let  outtageActualPredictedSum = 0
      for (let i =0; i < relativePredictedInsideRange.length; i++) {
         outtageActualPredicted.push( actualTotal * relativePredictedInsideRange[i])
         outtageActualPredictedSum = outtageActualPredictedSum  + (actualTotal * relativePredictedInsideRange[i])
      }
    
    const TotalPredictedLoss = outtageActualPredictedSum - ActualInsideRangeSum
    this.result = TotalPredictedLoss
      console.log("TotalPredictedLoss", TotalPredictedLoss)
    return TotalPredictedLoss
      
    }
    
  }

  
});
