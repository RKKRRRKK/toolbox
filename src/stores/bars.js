import { defineStore } from 'pinia';

export const useBarsStore = defineStore('bars', {
  state: () => ({
    count: 4 // Initial number of bars
  }),
  actions: {
    addBar() {
      this.count += 1; // Increment the count by 1
    },

    removeBar() {
      this.count -= 1; // Decrement the count by 1
    }
  }
});