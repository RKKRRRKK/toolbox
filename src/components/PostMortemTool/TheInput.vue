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
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const data = {
            hours: [],
            average_gmv: [],
            actual_gmv: [],
            Q1: [],
            Q3: [],
            avg_loss: [],
            max_loss: [],
            min_loss: [],
            actual_gmv_euros: [],
            average_gmv_euros: [],
            gmv_part: [],
            days: [],
        };

        // Skip the header,  start from index 1
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (row.length === 12) { // Ensure the row has the correct number of columns
                // Convert hour from integer to time format "X:00"
                // const hourFormatted = `${parseInt(row[0].trim())}:00`;
                // data.hours.push(hourFormatted); // Store the formatted hour
                data.average_gmv.push(parseFloat(row[0].trim()));
                data.Q3.push(parseFloat(row[1].trim()));
                data.Q1.push(parseFloat(row[2].trim()));
                data.actual_gmv.push(parseFloat(row[3].trim()));
                data.hours.push(parseFloat(row[4].trim()));
                data.avg_loss.push(parseFloat(row[5].trim()));
                data.max_loss.push(parseFloat(row[6].trim()));
                data.min_loss.push(parseFloat(row[7].trim()));
                data.actual_gmv_euros.push(parseFloat(row[8].trim()));
                data.average_gmv_euros.push(parseFloat(row[9].trim()));
                data.gmv_part.push(parseFloat(row[10].trim()));
                data.days.push(parseFloat(row[11].trim()))
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

.file-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.2rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.upload-button {
    padding: 0.65rem 1.5rem;
    background-color: #ca6161;
    color: #fff;
    border: none;
    border-radius: 0.2rem;
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
}

.upload-button:hover {
    background-color: #bb0808;
}

.upload-button:active {
        background-color: #630101;
        box-shadow: none;
        transform: translateY(1px);
    }



</style>