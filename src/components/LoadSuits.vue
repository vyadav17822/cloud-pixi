<template>
    <div>
        <label class="upload-btn">
            <input type="file" @change="handleFileUpload">
            <button @click="uploadFile">Upload</button>
        </label>
      <div v-if="data" class="table-res">
        <table class="table">
          <thead>
            <tr>
              <!-- <th v-for="(cell, index) in data[0]" :key="index">{{ cell }}</th> -->
              <th> Row</th>
              <th> Title</th>
              <th> Status</th>
              <th> Run</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in data.slice(2)" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{cell }}</td>
              <td v-if="this.rowsStatus[rowIndex] === undefined"><span class="bg-null"></span></td>
              <td v-else-if="this.rowsStatus[rowIndex] === 'success'"><span class="bg-success" >.</span></td>
              <td v-else-if="this.rowsStatus[rowIndex] === 'failed'"><span class="bg-failed" >.</span></td>
              <td><button class="btn btn-primary" @click="runCommand(row, rowIndex)"> > </button> </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import axios from 'axios';
  
  export default {
    name: 'LoadSuits',
    data() {
      return {
        uploadedFile: null,
        fileToUpload: null,
        data: null,
        rowsStatus: []
      };
    },
    methods: {
      handleFileUpload(event) {
        this.fileToUpload = event.target.files[0];
      },
      async uploadFile() {
        const reader = new FileReader();
        reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(sheet['!ref']);

        let rowData = [];
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          const cellAddress = { c: 1, r: rowNum };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const cell = sheet[cellRef];
          if(cell){
            if(!(cell.v).startsWith("#")){
                rowData.push([rowNum, cell.v]);
            }
          }
        //   this.rowData.push(cell ? cell.v : '');
          this.data = rowData;
        }
        console.log("Row data::: ", this.data);
        };
        reader.readAsArrayBuffer(this.fileToUpload);
      },
      runCommand(row, rowIndex){
        console.log("Data: ", row, rowIndex);

        let requestBody = {
            "username": "temproot",
            "hostname": "10.220.192.219",
            "port": 22,
            "password": "infinera",
            "interface": "CLI",
            "handle": "show card",
        }
        axios.post('http://127.0.0.1:8081/api/connectNE/', requestBody)
        .then(res => {
            console.log(res);
            this.rowsStatus[rowIndex] = "success"
        })
        .catch(error => {
            console.log(error);
           this.rowsStatus[rowIndex] = "failed"
        })
      }
    }
  };
  </script>
  
  <style scoped>
  .upload-btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .upload-btn:hover {
    background-color: #45a049;
  }
  
  .table-res {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th,
  .table td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  .bg-null { background-color: #ffffff; width: 100%; height: 100%; display: block; }
  .bg-success {
     background-color: #008000;
     width: 100%; 
     height: 100%; 
     display: block; 
  }
  .bg-failed{ background-color: #ff0000; width: 100%; height: 100%; display: block; }
  </style>
  
  