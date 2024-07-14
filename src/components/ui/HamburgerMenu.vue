<template>
    <div class="container" @click="openBurger()" @mouseleave="closeBurger()" :class="opened ? 'change' : 'container'">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
    </div>
    <div class="menu" v-if="opened" @mouseenter="keepOpen()" @mouseleave="closeBurger()">
      <nav>
        <!-- <router-link to="/texttool">TextTool</router-link>
        <router-link to="/colortool">ColorTool</router-link> -->
        <router-link to="/postmortem">PostMortem</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const opened = ref(false)
  
  function openBurger() {
    opened.value = !opened.value
    console.log(opened)
  }
  
  function closeBurger() {
    opened.value = false
    console.log(opened)
  }
  
  function keepOpen() {
    opened.value = true
  }
  </script>
  
  <style scoped>
  nav {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;  
    margin-top: 2.5rem;
    padding: 1rem;
    width: 100%;
    height: 100%;
    border: 2px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    border-radius: 0.5rem;
  }
  
  .menu {
    position: absolute;
    z-index: 1;
    width: 10rem;
    height: 10rem;
  }
  
  .container {
    margin-top: 0.75rem;
    margin-right: 0.5rem;
    position: absolute;
    display: inline-block;
    cursor: pointer;
    z-index: 2;
  }
  
  .bar1, .bar2, .bar3 {
    width: 35px;
    height: 5px;
    background-color: #333;
    margin: 6px 0;
    transition: 0.4s;
  }
  
  /* Rotate first bar */
  .change .bar1 {
    transform: translate(0, 11px) rotate(-45deg);
  }
  
  /* Fade out the second bar */
  .change .bar2 {opacity: 0;}
  
  /* Rotate last bar */
  .change .bar3 {
    transform: translate(0, -11px) rotate(45deg);
  }
  </style>
  