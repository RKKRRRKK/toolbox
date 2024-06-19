<template>
    <header>
      <!-- Navigation Links -->
      <nav v-if="!isPostmortem">
        <router-link to="/texttool">TextTool</router-link>
        <router-link to="/colortool">ColorTool</router-link>
        <router-link to="/postmortem">PostMortem</router-link>
      </nav>
    </header>
    <!-- Router View -->
    <router-view></router-view>
</template>

<script setup>
import { useRoute } from 'vue-router';
import {computed } from 'vue';

const route = useRoute();
const isPostmortem = computed(() => route.path === '/postmortem');

</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

header {
  display: flex;
  width: 100vw;
  justify-content: flex-end;
  padding-right: 0.5rem;
}

nav {
  display: flex;
  gap: 20px;
  padding: 10px;
  background-color: #ffffff;
}

router-link {
  text-decoration: none;
  color: #333;
}


</style>