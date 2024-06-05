<template>
    <div class="input">
        <form class="input_form" @submit.prevent="assignData">
            <label for="csvFile">Upload a CSV file:</label>
            <input type="file" id="csvFile" name="csvFile" accept=".csv" @change="storeFile" class="file-input">
            <button type="submit" class="upload-button">Upload</button>
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
    console.log("assing data triggered")
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const data = {
            hours: [],
            on_h_gmv: [],
            off_havg_gmv: [],
            off_hmin_gmv: [],
            off_hmax_gmv: [],
            on_total_gmv: [],
            days_accounted: [],
            array_gmv: [],
            array_date: [],
            array_order: [],
        };

        // a.hour as hours,
        // a.actual_GMV as on_h_gmv,
        // b.average as off_havg_gmv,
        // b.min as off_hmin_gmv,
        // b.max as off_hmax_gmv,
        // a.total_gmv as on_total_gmv,
        // array_gmv,
        // array_date,
        // array_order,
        // days_avg as days_accounted,

        // Start processing from the second line to skip the header
        for (let i = 1; i < lines.length; i++) {
            // Split line only on commas not inside quotes
            const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            if (row.length < 10) continue; // Skip lines that do not have a complete data set

            // Parse individual fields
            data.hours.push(parseFloat(row[0].trim()));
            data.on_h_gmv.push(parseFloat(row[1].trim()));
            data.off_havg_gmv.push(parseFloat(row[2].trim()));
            data.off_hmin_gmv.push(parseFloat(row[3].trim()));
            data.off_hmax_gmv.push(parseFloat(row[4].trim()));
            data.on_total_gmv.push(parseFloat(row[5].trim()));
            data.days_accounted.push(parseFloat(row[9].trim()));

            // Parse JSON array fields directly
            data.array_gmv.push(JSON.parse(row[6].trim()));
            data.array_date.push(JSON.parse(row[7].trim()));
            data.array_order.push(JSON.parse(row[8].trim()));
        }
        console.log("data in the input component", data)
        variablesStore.setData(data);
    };
    reader.readAsText(fileToRead.value);
}



</script>

<style scoped>
.input {
    display: flex;
    align-self: center;
    width: 100%;
}

.input_form {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.file-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.2rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    width: 100%;
}

.upload-button {
    padding: 0.65rem 1.5rem;
    background-color: rgb(234, 179, 117);
    color: #fff;
    border: none;
    border-radius: 0.2rem;
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
    width: 100%;
}

.upload-button:hover {
    background-color: rgba(237, 150, 50, 1);
}

.upload-button:active {
        background-color: rgb(82, 50, 14);
        box-shadow: none;
        transform: translateY(1px);
    }



</style>