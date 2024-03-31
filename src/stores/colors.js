import { defineStore } from 'pinia'
import { useBarsStore } from './bars'
import {useFiltersStore} from './filters'
import convert from 'color-convert'

export const useColorsStore = defineStore('colors', {
  state: () => ({
    barColors: [],
    baseColor: '#fcba03',
    harmony: 'comp',
    saturation_diff: 10,
    lightness_diff: 10,
  }),
  actions: {
    generateColors(color_array) {
      this.barColors = color_array
      const filtersStore = useFiltersStore()
      let hsl_again = convert.hex.hsl.raw(color_array[0])
      filtersStore.saturation = hsl_again[1]
      filtersStore.lightness = hsl_again[2]
      console.log("hsl_again[1]", hsl_again[1])
  
    },
    assignColor(color) {
      console.log('assignColor action processed with', color)
      const barsStore = useBarsStore()
      this.baseColor = color
      this.createHarmony(this.harmony)

      
    },

    assignSaturationDiff(saturation) {
      this.saturation_diff = saturation
      this.createHarmony(this.harmony)
    },
    assignLightnessDiff(lightness) {
      this.lightness_diff = lightness
      this.createHarmony(this.harmony)
    },

    assignHarmony(harmony) {
      this.harmony = harmony
      console.log('assign harmony action processed with', harmony)
      this.createHarmony(harmony)
    },

    createHarmony(harmony) {
      console.log('create harmony action processed with', harmony, 'and', this.baseColor)
      const barsStore = useBarsStore()
      let first_color = convert.hex.hsl.raw(this.baseColor)
      console.log('first color', first_color)
      let n_colors = barsStore.count
      console.log('number of colors', n_colors)
      let additive = 360 / n_colors
      console.log('additive', additive)

      if (harmony === 'anal') {
        let color_array = []
        for (let i = 0; i < n_colors; i++) 
        {
          let newColor = first_color.slice()
          newColor[0] = Math.min((newColor[0] + (i * 30)) % 360, 360)

          console.log("anal color created", newColor)
          color_array.push('#' + convert.hsl.hex.raw(newColor))
        }
        this.generateColors(color_array)
        console.log(color_array)

      }

       else if (harmony === 'comp') {
        let color_array = []
        for (let i = 0; i < n_colors; i++) 
        {
          let newColor = first_color.slice()
          console.log('newColor', newColor)

          newColor[0] = Math.min(newColor[0] + i * additive, 360)
          color_array.push('#' + convert.hsl.hex.raw(newColor))
        }
        console.log('color_array', color_array)
        this.generateColors(color_array)

      }

      else if (harmony === 'mono_s') {
        let color_array = [];
        const direction = first_color[1] > 50 ? -1 : 1; // Determine direction based on initial saturation
    
        for (let i = 0; i < n_colors; i++) {
            let newColor = first_color.slice();
            // Apply direction and ensure wrapping
            let adjustment = ((i * this.saturation_diff) % 100) * direction;
            newColor[1] = (100 + newColor[1] + adjustment) % 100;
            console.log("iteration",i, "color",newColor)
            color_array.push('#' + convert.hsl.hex.raw(newColor));
        }
        this.generateColors(color_array);
    }

      
    else if (harmony === 'mono_l') {
      let color_array = [];
      const direction = first_color[2] > 50 ? -1 : 1; // Determine direction based on initial lightness
  
      for (let i = 0; i < n_colors; i++) {
          let newColor = first_color.slice();
          // Apply direction and ensure wrapping
          let adjustment = ((i * this.lightness_diff) % 100) * direction;
          newColor[2] = (100 + newColor[2] + adjustment) % 100;
          color_array.push('#' + convert.hsl.hex.raw(newColor));
      }
      this.generateColors(color_array);
  }


    }
  }

})
