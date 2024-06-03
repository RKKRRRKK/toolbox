<template>
    <div>
      <button class="button" @click="compressAndGenerateAndCopyURL">Generate and Copy URL</button>
      <!-- <p v-if="copySuccess">URL copied to clipboard, share with care.</p> -->
      <p v-if="copyError">{{ copyError }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import pako from 'pako';
  import * as brotli from 'brotli-wasm';
  import { useVariablesStore } from '@/stores/PostMortem/variables';
  
  const route = useRoute();
  const store = useVariablesStore();
  const copySuccess = ref(false);
  const copyError = ref('');

  
  const urlSafeBase64Encode = (data) => {
    return btoa(data)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };
  
  const urlSafeBase64Decode = (data) => {
    let base64 = data
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  };
  
  const loadAndDecompressData = async () => {
  const compressedData = route.query.data;
  if (compressedData) {
    try {
      const decodedData = urlSafeBase64Decode(compressedData);
      const charData = decodedData.split('').map(c => c.charCodeAt(0));
      const binData = new Uint8Array(charData);
      const decompressedData = JSON.parse(pako.inflate(binData, { to: 'string' }));

      store.data = decompressedData.data;
      store.start = decompressedData.start;
      store.model = decompressedData.model;

      await store.waitForProcessedData();

      store.offtime = decompressedData.offtime;
      store.ontime = decompressedData.ontime;
      
    } catch (error) {
      console.error("Error decoding or decompressing URL data:", error);

    }
  }
};
  
const compressAndGenerateAndCopyURL = async () => {
  try {
    const dataToCompress = {
      data: store.data,
      start: store.start,
      offtime: store.offtime,
      ontime: store.ontime,
      model: store.model,
    };
    const json = JSON.stringify(dataToCompress);
    const binData = new TextEncoder().encode(json);
    const compressedData = pako.deflate(binData);
    const base64Data = urlSafeBase64Encode(String.fromCharCode(...compressedData));
    const url = `${window.location.origin}${window.location.pathname}?data=${base64Data}`;
    await navigator.clipboard.writeText(url);
    alert('URL has been copied to clipboard. Contains internal data, share cautiously!');
    copySuccess.value = true;
  } catch (error) {
    console.error("Error compressing or copying data:", error);
    copyError.value = 'Failed to copy URL to clipboard.';
    alert(copyError.value);
  }
};

  
  onMounted(loadAndDecompressData);
  </script>
  
  <style scoped>
.button {
    padding: 0.65rem 0.8rem;
    background-color: #ccc;  /* rgb(233, 171, 100); */
    color: #fff;
    border: none;
    border-radius: 0.2rem;
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
    scale: 0.8;
}

.button:hover {
    background-color: rgba(237, 150, 50, 1);
}

.button:active {
        background-color: rgb(82, 50, 14);
        box-shadow: none;
        transform: translateY(1px);
    }


</style>