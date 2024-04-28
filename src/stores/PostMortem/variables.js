import { defineStore } from 'pinia';

export const useVariablesStore = defineStore('variables', {
  state: () => ({
    start: '',
    end: '',
    offtime: '',
    ontime: '',
    storefront: '',
    platform: '',
    SQL: '',
    data:{},
    isNegative: true,
    
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

    setSQL(value) {
      this.SQL = value
      console.log("setSQL went through with", value)
    },
    
    setData(data) {
      this.data = data;
      console.log("data set with", data)
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


  }
});