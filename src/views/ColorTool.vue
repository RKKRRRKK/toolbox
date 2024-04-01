<template>
<h1>Harmony Generator </h1>
<div id="wrapper">
<TheBars id="bars"/>
<div id="separator"></div>
<div id="components">
<div id="harmony-elements">
<h2 id="title">Color Selector</h2>
<div id="hb">
<TheHarmonizer id="harmony"/>
<TheReplicator id="replicate"/>
</div>
</div>
<div id="filters">
<h2 id="title">Filters</h2>
<TheFilter id="filter"/>
</div>
</div>
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
    width: 80%;
    height: 100vh;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-grow: 3;
    flex-shrink: 3;
    flex-wrap: wrap;
    
}


#bars {
    display: flex;
    width: 80%;
    margin: auto;
    flex-grow: 1;
    flex-shrink: 1;
    padding-top: 2rem;
    
}

#hb {
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    margin: auto;
    padding: 1rem;


}


#replicate {
    display: flex;
    align-items: center;
    margin: auto;
    flex-grow: 1;
    flex-shrink: 1;
    padding-top: 1rem;
    gap: 5rem;

    align-items: flex-end;

}

#filter {
    display: flex;
    flex-direction: column;
    margin: auto;
    flex-grow: 1;
    flex-shrink: 1;
    justify-content: space-around;
    

}

#title {
    margin: auto;
    padding-top: 1rem;
    padding-bottom: 0rem;
    

}

#components {
    display: flex;
    flex-direction: row;
    flex-grow: 3;
    flex-shrink: 3;
    flex-wrap: wrap;
    

 
    
}

#harmony-elements, #filters {
    display: flex;
    flex-direction: column;
    border: 1px solid #dfdfdf;
    margin-top: 0rem;
    padding-top: 0rem;

}

#harmony-elements {
    margin-left: auto;
    margin-right: 2rem;
    background-color: #fcfcfc;
    padding: 1rem;
    margin-top: 0rem;
    padding-top: 0rem;
}

#filters {
    margin-right: auto;
    margin-left: 2rem;
    background-color: #fcfcfc;
    padding: 1rem;
    margin-top: 0rem;
    padding-top: 0rem;
    display: flex;
}


#separator {
    height: 2rem;
    background-color: white;
    display: flex;
}

</style>