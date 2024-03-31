<template>
<h1>Harmony Generator </h1>
<div id="wrapper">
<TheBars id="bars"/>
<TheHarmonizer id="harmony"/>
<TheReplicator/>
<TheFilter/>
</div>

</template>

<script setup>
import TheBars from "../components/ColorTool/TheBars.vue"
import TheReplicator from '../components/ColorTool/TheReplicator.vue'
import TheHarmonizer from '../components/ColorTool/TheHarmonizer.vue'
import TheFilter from '../components/ColorTool/TheFilter.vue'
</script>

<style scoped>

#wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
}

#bars {
    display: flex;
    gap: 0.1rem;
}

#harmony {
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}


</style>