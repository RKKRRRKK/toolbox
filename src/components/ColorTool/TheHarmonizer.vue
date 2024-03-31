<template>
  <div id="wrapper">
    <div id="color-picker">
      <label for="baseColor">Base Color HEX</label>
      <input type="text" id="baseColor" name="baseColor" maxlength="9" v-model="baseColor" />
      <button @click="assignColor()">Confirm</button>
    </div>

    <div id='harmony'>
    <div id="comanal">
        <div id="analogous">
      <input
        type="radio"
        id="analogous"
        name="harmony"
        value="anal"
        v-model="harmony"
        @change="assignHarmony"
      />
      <label for="analogous">Analogous</label><br />
    </div>
    <div id="complementary">
      <input
        type="radio"
        id="complementary"
        name="harmony"
        value="comp"
        v-model="harmony"
        @change="assignHarmony"
      />
      <label for="complementary">Complementary</label><br />
    </div>
</div>
      <div id="mono_module">
        <div id="mono_l">
        <input
          type="radio"
          id="monochromatic"
          name="harmony"
          value="mono_l"
          v-model="harmony"
          @change="assignHarmony"
        />
        <label for="monochromatic">Monochromatic Lightness</label><br />
        <input type="range" min="5" max="30" value="10" class="slider" id="lightness"
        v-model="lightness"
        @change="assignLightnessDiff" />
    </div>
     
        <div id="mono_s">
        <div></div>
        <input
          type="radio"
          id="monochromatic"
          name="harmony"
          value="mono_s"
          v-model="harmony"
          @change="assignHarmony"
        />
        <label for="monochromatic">Monochromatic Saturation</label><br />
        <input type="range" min="5" max="30" value="10" class="slider" id="saturation"
        v-model="saturation"
        @change="assignSaturationDiff" />
    </div>
    </div>
    </div>
      </div>


</template>

<script setup>
import { ref } from 'vue'
import { useColorsStore } from '@/stores/colors'

const baseColor = ref('#fcba03')
const harmony = ref('comp')
const colorsStore = useColorsStore()
const lightness = ref('10')
const saturation = ref('10')

function assignColor() {
  console.log('Assign color triggered with', baseColor.value)
  colorsStore.assignColor(baseColor.value)
}

function assignHarmony() {
  console.log('Assign harmony triggered with', harmony.value)
  colorsStore.assignHarmony(harmony.value)
}

function assignLightnessDiff() {
    colorsStore.assignLightnessDiff(lightness.value)
}

function assignSaturationDiff() {
    colorsStore.assignSaturationDiff(saturation.value)
}

</script>

<style scoped>

#harmony {
    display: flex;
    flex-direction: column;
}

#comanal {
    display: flex;
    flex-direction: row;
    padding-top: 0.5rem;
    gap: 1rem;
}

#mono_module {
    display: flex;
    flex-direction: row;
}

#mono_l {
    display: flex;
    flex-direction: column
}

#mono_s {
    display: flex;
    flex-direction: column;
}

</style>
