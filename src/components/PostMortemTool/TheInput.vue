<template>
    <div class="input">
        <form class="input_form" @submit.prevent="assignData">
            <label for="csvFile">Upload a CSV file:</label>
            <input type="file" id="csvFile" name="csvFile" accept=".csv" @change="storeFile">
            <button type="submit">Upload</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useVariablesStore } from '@/stores/PostMortem/variables.js'

const variablesStore = useVariablesStore()
const fileToRead = ref(null) // Store the file reference

function storeFile(event) {
    fileToRead.value = event.target.files[0] ? event.target.files[0] : null;
}

function assignData() {
    if (!fileToRead.value) {
        alert("Please select a CSV file first.");
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const data = {
            dates: [],
            hours: [],
            average_gmv: [],
            actual_gmv: [],
            Q1: [],
            Q3: [],
        };

        // Skip the header, hence start from index 1
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (row.length === 6) { // Ensure the row has the correct number of columns
                // Convert hour from integer to time format "X:00"
                const hourFormatted = `${parseInt(row[0].trim())}:00`;
                data.hours.push(hourFormatted); // Store the formatted hour

                data.actual_gmv.push(parseFloat(row[4].trim()));
                data.dates.push(row[5].trim());
                data.Q1.push(parseFloat(row[3].trim()));
                data.Q3.push(parseFloat(row[2].trim()));
                data.average_gmv.push(parseFloat(row[1].trim()));
            }
        }
        variablesStore.setData(data);
        console.log(data);
    };
    reader.readAsText(fileToRead.value);
}
</script>

<style scoped>
.input {
    display: flex;
    align-self: center;
}

.input_form {
    display: flex;
    flex-direction: column;
}
</style>