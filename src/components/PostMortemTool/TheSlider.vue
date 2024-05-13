<template>
    <div :class="variablesStore.timeframeToggle ? 'visible' : 'invisible'" class="rail" ref="rail">
        <div :class="variablesStore.isNegative ? 'from' : 'fromp'" @mousedown="startDrag($event, 'from')" ref="from" :style="{ left: fromPosition }"></div>
        <div :class="variablesStore.isNegative ? 'to' : 'top'" @mousedown="startDrag($event, 'to')" ref="to" :style="{ left: toPosition }"></div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useVariablesStore } from '@/stores/PostMortem/variables'; 

const variablesStore = useVariablesStore();
const rail = ref(null);
const from = ref(null);
const to = ref(null);
const dragging = ref(null);

// Converts hour 0-23 to a position that centers the element
const calculatePosition = (time) => {
    const percentage = (time / 23) * 100;
    return `calc(${percentage}% - ${0.9}rem)`; // Adjust to half of width
};

// Reactive references for position based on store
const fromPosition = computed(() => calculatePosition(variablesStore.offtime));
const toPosition = computed(() => calculatePosition(variablesStore.ontime));

function startDrag(event, element) {
    dragging.value = element;
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
}

function doDrag(event) {
    if (!dragging.value) return;

    const rect = rail.value.getBoundingClientRect();
    const halfMarkerWidth = (dragging.value === 'from' ? from.value.offsetWidth : to.value.offsetWidth) / 2;
    let newPos = ((event.clientX - rect.left - halfMarkerWidth) / (rect.width - halfMarkerWidth * 2)) * 23;
    newPos = Math.round(newPos); // Snaps to nearest whole number
    
    // Stops overflow 
    newPos = Math.max(0, Math.min(newPos, 23));

    // Stops crossing of markers
    if (dragging.value === 'from' && newPos >= variablesStore.ontime) {
        newPos = Math.max(0, variablesStore.ontime);
    } else if (dragging.value === 'to' && newPos <= variablesStore.offtime) {
        newPos = Math.min(23, variablesStore.offtime);
    }

    if (dragging.value === 'from') {
        variablesStore.offtime = newPos;
        console.log("offtime moved to", newPos, typeof(newPos))
    } else {
        variablesStore.ontime = newPos;
    }
}

function stopDrag() {
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
    dragging.value = null;
}



</script>

<style scoped>
.rail {
    display: flex;
    position: relative;
    width: 96.5%;
    height: 2rem; 
    background-color: none;
    z-index: 999;
}

.from, .to {
    position: absolute;
    width: 1.8rem; 
    height: 100%;
    border-radius: 15% 15% 50% 50%;
    cursor: pointer;
    background-color: #d89393;
    color: gray;
}

.from:hover, .from:active, .to:hover, .to:active {
    background-color: #ffc1c1;
    cursor: pointer
}

.fromp, .top {
    position: absolute;
    width: 1.8rem;
    height: 100%;
    border-radius: 15% 15% 50% 50%;
    cursor: pointer;
    background-color: #93d8aa;
    color: gray;
}

.fromp:hover, .fromp:active, .top:hover, .top:active {
    background-color: #c1ffc9;
    cursor: pointer
}

.visible {
    opacity: 100%
}

.invisible {
    opacity: 0%;
}


</style>
