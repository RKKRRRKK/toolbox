import { defineStore } from 'pinia'
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
    updateEstimations(offtimes) {
      const actualOutsideRange = this.actualgmv.filter((_, index) => !offtimes.includes(index));
    //   console.log("actualOutsideRange: ", actualOutsideRange)
      const predictionOutsideRange = this.averagegmv.filter((_, index) => !offtimes.includes(index));
      const totalPrediction = this.averagegmv.reduce((acc, curr) => acc + curr, 0);
    //   console.log("totalPrediction: ", totalPrediction)
      const actualOutsideRangeTotal = actualOutsideRange.reduce((acc, curr) => acc + curr, 0);
    //   console.log("actualOutsideRangeTotal: ", actualOutsideRangeTotal)
      
      const relativeValuesPrediction = this.averagegmv.map(gmv => gmv / totalPrediction);
    //   console.log("relativeValuesPrediction: ", relativeValuesPrediction)
      const relativePredictedInsideRange = offtimes.map(index => relativeValuesPrediction[index]);
    //   console.log("relativePredictedInsideRange: ", relativePredictedInsideRange)
      const actualInsideRange = offtimes.map(index => this.actualgmv[index]);
    //   console.log("actualInsideRange: ", actualInsideRange)
      const actualInsideRangeSum = actualInsideRange.reduce((acc, curr) => acc + curr, 0);
    //   console.log("actualInsideRangeSum OKAY: ", actualInsideRangeSum)

      const relativePredictedInsideRangeTotal = relativePredictedInsideRange.reduce((acc, curr) => acc + curr, 0);
    //   console.log("relativePredictedInsideRangeTotal: ", relativePredictedInsideRangeTotal)
      
      const predictedTotalMinusInsideRelative = 1 - relativePredictedInsideRangeTotal;
    //   console.log("predictedTotalMinusInsideRelative: ", predictedTotalMinusInsideRelative)
      const actualTotal = (actualOutsideRangeTotal / predictedTotalMinusInsideRelative);  //deleted * 100 from here ... why was it here?
    //   console.log("actualTotal: ", actualTotal)

      const outageActualPredicted = relativePredictedInsideRange.map(relative => actualTotal * relative);
      const outageActualPredictedSum = outageActualPredicted.reduce((acc, curr) => acc + curr, 0);

      const totalPredictedLoss = outageActualPredictedSum - actualInsideRangeSum;
      this.result = totalPredictedLoss;
      console.log("TotalPredictedLoss", totalPredictedLoss);
      return totalPredictedLoss;
    }
  }
});