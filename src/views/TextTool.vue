<template>
  <div id= "container">
  <h1 id="title">String Processor for SQL / Excel</h1>
  <textarea v-model="text" class="input" rows="16" cols="60">
  </textarea>
  <div id="buttons">
  <p id="error" v-if="error">{{ error }}</p>
  <button @click="column()">Column <-> List</button>
  <button @click="comma()">Comma, Toggle</button>
  <button @click="parenthesis()">(Parenthesis) Toggle</button>
  <button @click="quotes()">"Quotes" Toggle</button>
  </div>
  </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  let text = ref('paste your column or list here');
  let error = ref("")
  
  function isColumn() {
    return text.value.includes("\n");
  }
  
  function column() {
    console.log(text.value)
    let array = []
    array.push(text.value)
    console.log(array)
    if (text.value.includes("\n")) {
      let comma_present = text.value.includes(",")
      let decommad = text.value.replace(/,/g, '')
      let list = decommad.split("\n")
      console.log(list)
      if (!comma_present) {
      text.value = list.toString().replace(/,/g, ' ')
      }
      else {text.value = list.toString()}
    }
    else {
    let array = []
    if (text.value.includes(',')) {
    array = text.value.split(',')
    }
    else {
      array = text.value.split(' ')
    }
    console.log(array)
    text.value = array.join('\n')
    
    } 
  }
  
  
  function comma() {
    let columnity = isColumn()
    if (columnity) {
      console.log("it's a column, removing commas or returning")
      if (text.value.includes(',')){
        text.value = text.value.replace(/,/g, '')
      }
      else {
        //I need to show the user an error here
        error.value = "Please don't attempt to add commas to a column!";
        // Clear the error message after 3 seconds
        setTimeout(() => {
          error.value = "";
        }, 1500);
  
      }
      return
    
    }
    console.log("columnity check", columnity)
  
    let value = ''
  
    if (text.value.includes(',')) {
     value  = text.value.replace(/,/g, ' ');
    }
    else {
      let array = []
      array = text.value.split(/\s+/)
      array = array.join(',')
      value = array
    }
    
    text.value = value
    console.log("value assigned:", value)
    
  }
  
  
  function parenthesis() {
     let firstChar = text.value[0]
     let lastChar = text.value[text.value.length - 1]
  
     if (firstChar ==='(' && lastChar === ')') {
      text.value = text.value.replace(/\(/g, '')
      .replace(/\)/g, '').trim()
     }
  
     else {
      text.value = '(' + text.value + ')'
     }
  
    }
  
    function quotes() {
    let columnity = isColumn()
  
    if (text.value.includes('"') || text.value.includes("'"))
    {
      text.value = text.value.replace(/"/g, '')
      text.value = text.value.replace(/'/g, '')
      return 
    }
    let array = []
      if (text.value.includes(',')) {
    array = text.value.split(',')
    console.log("split test", array)
    }
    else if (!text.value.includes('\n')) {
      array = text.value.split(' ')
    }
    else {
      array = text.value.split('\n')
  
    }
  console.log(array)
    array = array.filter((word) => word != '')
  
      let newstring = ''
     for (let i = 0; i < array.length; i++) {
      let word = array[i].toString()
      word = '"' + word + '"'
  
     newstring = newstring + ' ' + word
     console.log(newstring)
    }
    newstring = newstring.trim()
    text.value = newstring
     if (columnity) {
      column()
     }
    }
  </script>
  
  <style>
  
  #error {
    color: red; 
  }
  
  #container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10rem;
  
  }
  
  #buttons {
    display: flex;
    padding-top: 0.5rem;
    gap: 0.4rem;
  }
  
  #title {
    padding-bottom: 1rem;
  }
  
  </style>