<template>
    <div class="rail" ref="rail">
        <div class="from" @mousedown="startDrag($event, 'from')" ref="from" :style="{ left: fromPosition }"></div>
        <div class="to" @mousedown="startDrag($event, 'to')" ref="to" :style="{ left: toPosition }"></div>
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

// Convert hour (0-23) to a position that centers the element
const calculatePosition = (time) => {
    const percentage = (time / 23) * 100;
    return `calc(${percentage}% - ${1}rem)`; // Adjust 10px to half of min-width of .from and .to if different
};

// Reactive references for position based on store times
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
    newPos = Math.round(newPos); // Snap to nearest whole number
    
    // Clamping the time to be within 0 to 23
    newPos = Math.max(0, Math.min(newPos, 23));

    // Prevent markers from crossing each other
    if (dragging.value === 'from' && newPos >= variablesStore.ontime) {
        newPos = Math.max(0, variablesStore.ontime - 1);
    } else if (dragging.value === 'to' && newPos <= variablesStore.offtime) {
        newPos = Math.min(23, variablesStore.offtime + 1);
    }

    if (dragging.value === 'from') {
        variablesStore.offtime = newPos;
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
    height: 2rem; /* Adjust height for better visibility */
    background-color: none;
    transform: translateY(3rem);
    z-index: 999;
}

.from, .to {
    position: absolute;
    width: 2rem; /* or 20px or any other fixed size */
    height: 100%;
    border-radius: 0.5rem;
    cursor: pointer;
}

.from {
    background-color: #b47777;
}

.to {
    background-color: #85bd85;
}
</style>
