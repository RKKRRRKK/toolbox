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
      const predictionOutsideRange = this.averagegmv.filter((_, index) => !offtimes.includes(index));
      const totalPrediction = this.averagegmv.reduce((acc, curr) => acc + curr, 0);
      const actualOutsideRangeTotal = actualOutsideRange.reduce((acc, curr) => acc + curr, 0);
      
      const relativeValuesPrediction = this.averagegmv.map(gmv => gmv / totalPrediction);
      const relativePredictedInsideRange = offtimes.map(index => relativeValuesPrediction[index]);
      const actualInsideRange = offtimes.map(index => this.actualgmv[index]);
      const actualInsideRangeSum = actualInsideRange.reduce((acc, curr) => acc + curr, 0);

      const relativePredictedInsideRangeTotal = relativePredictedInsideRange.reduce((acc, curr) => acc + curr, 0);
      const predictedTotalMinusInsideRelative = 1 - relativePredictedInsideRangeTotal;
      const actualTotal = (actualOutsideRangeTotal / predictedTotalMinusInsideRelative) * 100;

      const outageActualPredicted = relativePredictedInsideRange.map(relative => actualTotal * relative);
      const outageActualPredictedSum = outageActualPredicted.reduce((acc, curr) => acc + curr, 0);

      const totalPredictedLoss = outageActualPredictedSum - actualInsideRangeSum;
      this.result = totalPredictedLoss;
      console.log("TotalPredictedLoss", totalPredictedLoss);
      return totalPredictedLoss;
    }
  }
});