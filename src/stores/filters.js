import { defineStore } from 'pinia';
import { useColorsStore } from './colors';
import convert from 'color-convert';

export const useFiltersStore = defineStore('filters', {
  state: () => ({
    saturation: null,
    lightness: null,
    barColors: [],
  }),

  actions: {
    saturate(value) {
      const colorsStore = useColorsStore(); 
      this.saturation = 0;
      this.saturation += Number(value);
      this.barColors = colorsStore.barColors;
      console.log("saturation", this.saturation)
      let color_array = []

      for (let i = 0; i < this.barColors.length; i ++) {
        let hsl_color = convert.hex.hsl.raw(this.barColors[i])
        console.log(hsl_color)
        hsl_color[1] = Math.min(Math.max(this.saturation,0),100)
        console.log(hsl_color)
        color_array.push( "#" + convert.hsl.hex.raw(hsl_color))
      }
      console.log("saturated array", color_array)
      console.log("pre-saturated array", this.barColors)
      colorsStore.barColors = color_array
      colorsStore.baseColor = color_array[0]


    },

    lighten(value) {
      const colorsStore = useColorsStore(); 
      this.lightness = 0;
      this.lightness += Number(value);
      this.barColors = colorsStore.barColors;
      console.log("lightness", this.lightness)
      let color_array = []

      for (let i = 0; i < this.barColors.length; i ++) {
        let hsl_color = convert.hex.hsl.raw(this.barColors[i])
        console.log(hsl_color)
        hsl_color[2] = Math.min(Math.max(this.lightness,0),100)
        console.log(hsl_color)
        color_array.push( "#" + convert.hsl.hex.raw(hsl_color))
      }
      console.log("lightened array", color_array)
      console.log("pre-lightened array", this.barColors)
      colorsStore.barColors = color_array
      colorsStore.baseColor = color_array[0]


    },

    disable() {
      this.saturation = null;
    },


  }
});