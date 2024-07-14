<template>
    <div class="input">
        <form class="input_form" @submit.prevent="assignData">
            <input type="file" id="csvFiles" name="csvFiles" accept=".csv" @change="storeFiles" multiple class="file-input">
            <button type="submit" class="upload-button">Upload</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDashboardStore } from '@/stores/TheDashboard/data.js'

const dashboardStore = useDashboardStore()
const filesToRead = ref([])

function storeFiles(event) {
    console.log("storeFiles")
    filesToRead.value = Array.from(event.target.files);
}
function assignData() {
    console.log("assignData started");
    if (!filesToRead.value.length) {
        console.alert("Please select CSV files first.");
        return;
    }

    filesToRead.value.forEach(file => {
        const reader = new FileReader();

        reader.onload = () => {
            console.log("File loaded:", file.name);
            const text = reader.result;
            const fileName = file.name;
            const nameWithoutExtension = fileName.slice(0, -4); // Assuming .csv extension
            const lastChar = nameWithoutExtension[nameWithoutExtension.length - 1];
            console.log(`Processing file ${fileName} with lastChar ${lastChar}`);

            if (lastChar === '0') {
                parseCSV0(text);
            } else if (lastChar === '1') {
                parseCSV1(text);
            } else {
                console.log(`File ${fileName} does not match expected naming conventions.`);
            }
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsText(file);
    });
}

function parseCSV(text) {
    console.log("parseCSV")
    const rows = text.split('\n');
    const headers = rows.shift().split(',');
    return rows.map(row => {
        const data = row.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = data[index].trim();
        });
        return obj;
    });
}

function parseCSV0(text) {
    console.log("parseCSV0")
    const data = parseCSV(text);
    const hour = data.map(row => row.hour);
    const date = data.map(row => row.date);
    const gmv = data.map(row => row.gmv);
    const payment_provider_method = data.map(row => row.payment_provider_method);
    const holiday = data.map(row => row.holiday);
    const platform = data.map(row => row.platform);

    dashboardStore.setCSV0Data({ hour, date, gmv, payment_provider_method, holiday, platform });
}

function parseCSV1(text) {
    console.log("parseCSV1")
    const data = parseCSV(text);
    const sid_count = data.map(row => row.sid_count);
    const category = data.map(row => row.category);
    const operating_system = data.map(row => row.operating_system);
    const browser = data.map(row => row.browser);
    const date = data.map(row => row.date);
    const hour = data.map(row => row.hour);

    dashboardStore.setCSV1Data({ sid_count, category, operating_system, browser, date, hour });
}
</script>


<style scoped>
.input {
    display: flex;
    align-self: center;
    font-size: 0.8rem;
}

.input_form {
    display: flex;
    flex-direction: column;
}

.file-input {
    padding: 0.2rem;
    padding-bottom: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 0.2rem;
    margin-bottom: 0.5rem;
    width: 100%;
    height: 2.1vh;
}

.upload-button {
    padding: 0.65rem 1.5rem;
    background-color: rgb(234, 179, 117);
    color: #fff;
    border: none;
    border-radius: 0.2rem;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
     width: 100%;
     height: MAX(3vh, 2rem);
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