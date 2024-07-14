<template>
    <div class="wrapp">
        <div class="a"></div>
        <div class="b"></div>
        <div class="c"></div>
        <div class="d"></div>
        <div class="e"></div>
        <div class="f"></div>
        <div class="g"></div>
        <div class="h"></div>
        <div class="i"></div>
    </div>
    </template>

<script setup>

</script>


<style scoped>

.wrapp {
    display: flex;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    background-color: red;
}

.wrapp div {
    background-color: blue;
    width: 33%;
    height: 33%;
}


</style>