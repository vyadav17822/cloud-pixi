<template>
    <div class="data-table-child">
        <!-- <label class="upload-btn">
            <input type="file" @change="handleFileUpload">
            <button @click="uploadFile">Upload</button>
        </label> -->
      <div v-if="loadSuiteData" class="table-header">
        <table class="table">
          <thead>
            <tr>
              <!-- <th v-for="(cell, index) in data[0]" :key="index">{{ cell }}</th> -->
              <th> Row</th>
              <th> Title</th>
              <th> Reps</th>
              <th> Run</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in loadSuiteData.slice(2)" :key="rowIndex">
              <td class="table-row-number" v-for="(cell, cellIndex) in row" :key="cellIndex">{{cell }}</td>
              <td v-if="this.rowsStatus[rowIndex] === undefined"><span class="bg-null"></span></td>
              <td v-else-if="this.rowsStatus[rowIndex] === 'success'">
                <div class="progress-inner" />
                <div class="failed">Failed</div>
              </td>
              <td v-else-if="this.rowsStatus[rowIndex] === 'failed'"><span class="bg-failed" >.</span></td>
              <!-- <span class="button-trash-icon"> <i class="fas fa-ellipsis-h"></i> </span> -->
              <td>
                <button class="btn btn-primary" @click="runCommand(row, rowIndex)" style="background-color: #f3f6f9;"> <i class="fa fa-play" aria-hidden="true" style="color: #3699ff; background-color: #f3f6f9;"></i></button>
                <button class="btn btn-primary" @click="showLog" style="background-color: #f3f6f9;"> <i class="fas fa-ellipsis-h" aria-hidden="true" style="color: #3699ff; background-color: #f3f6f9;"></i></button>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  </template>
  
  <script>
  // import * as XLSX from 'xlsx';
  import axios from 'axios';

  export default {
    name: 'LoadSuits',
    props: {
      loadSuiteData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        uploadedFile: null,
        fileToUpload: null,
        data: null,
        rowsStatus: []
      };
    },
    methods: {
    
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
        axios.post('http://35.192.211.225:8000/api/connectNE/', requestBody)
        .then(res => {
            console.log(res);
            this.rowsStatus[rowIndex] = "success"
        })
        .catch(error => {
            console.log(error);
           this.rowsStatus[rowIndex] = "failed"
        })
      },
      showLog() {
        alert("Show Log:");
      }
    }
  };
  </script>
  
  <style scoped>
    .progress-inner {
      position: absolute;
      top: 0px;
      right: 0px;
      border-radius: 5px;
      background-color: #cf1414;
      width: 102px;
      height: 32px;
    }
    .failed {
      position: absolute;
      top: 7px;
      left: 33px;
    }
    .row-title {
      /* position: absolute; */
      top: 4px;
      right: 321.51px;
      width: 489.7px;
      height: 24px;
    }
    .table-row-number {
      position: relative;
      font-family: Poppins;
      font-weight: 600;
      color: #000;
    }
    .data-row {
      position: absolute;
      top: 534px;
      right: 49.64px;
      width: 869px;
      height: 32px;
      color: #23293d;
    }
    .table-row {
      position: absolute;
      top: 0px;
      right: 49.71px;
      width: 75px;
      height: 32px;
    }
    .button-edit-icon {
      position: absolute;
      top: 0px;
      right: 42.6px;
      width: 32.4px;
      height: 32px;
    }

    .table-header {
    position: absolute;
    width: calc(100% - 1px);
    top: 34px;
    right: 0px;
    left: 1px;
    height: 28px;
    font-size: 12px;
    color: #b5b5c3;
  }
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

  .data-table-child {
    position: absolute;
    top: 0px;
    left: 1px;
    background-color: #fff;
    width: 945px;
    height: 580px;
    overflow: scroll;
  }
  </style>
  
  