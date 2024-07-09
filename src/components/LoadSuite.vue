<template>
        <!-- <label class="upload-btn">
            <input type="file" @change="handleFileUpload">
            <button @click="uploadFile">Upload</button>
        </label> -->
      <div v-if="loadSuiteData" class="table-header">
        <table class="loadsuite-table">
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
            <tr v-for="(suite,row) in loadSuiteData" :key="row" >
            
              <td class="table-row-number" >{{row+1 }}</td>
              <td  class="table-row-number">
                <div class="loadsuite-title">{{suite.Title }}</div>
                </td>
                <td v-if="suite.status==='0'" ></td>
               <td v-else-if="suite.status==='1'" style="align-items: center !important; ">
                <button type="button" class="btn btn-primary"  style="background-color: blue;">Running</button>
               </td>
               <td v-else-if ="suite.status==='2'">
                <button type="button" class="btn btn-success"  style="background-color: green;">Completed</button>
              </td>
               <td v-else-if ="suite.status==='3'">
                <button type="button" class="btn btn-danger"  style="background-color: red;">Failed</button>
              </td>
              <td>
                <button class="btn btn-primary" @click="runCommand(suite)" style="background-color: #f3f6f9;"> <i class="fa fa-play" aria-hidden="true" style="color: #3699ff; background-color: #f3f6f9;"></i></button>
                <button class="btn btn-primary" @click="showLog" style="background-color: #f3f6f9;"> <i class="fas fa-ellipsis-h" aria-hidden="true" style="color: #3699ff; background-color: #f3f6f9;"></i></button>
               </td>
              
              </tr>
          </tbody>
        </table>
      </div>
  </template>
  
  <script>
  // import * as XLSX from 'xlsx';
  // import axios from 'axios';

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
        rowsStatus: [],
        filteredData: []
      };
    },
    methods: {
      created(){
        console.log("Load suite data:: ", this.loadSuiteData);      
      },
      async runCommand(suite){
        let command = suite.Code;
        suite.status = "1";
        try {
          let res = await this.$runSuiteCommand(command);
          console.log("Result: in run suite: ", res);
          suite.status = "2";
        } catch (error) {
          suite.status = "3";
        }
      },
      showLog() {
        alert("Show Log:");
      }
    }
  };
  </script>
  
  <style scoped>
    .loadsuite-title {
      top: 0px;
      right: 0px;
      line-height: 160%;
      display: inline-block;
      width: 404.6px;
      height: 24px;
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      color: #fff;
    }
 
    .table-row-number {
      position: relative;
      font-family: Poppins;
      font-weight: 600;
      color: #fff;
      font-size: 14px;
    }
 
    .table-header {
    width: 941px;
    top: 103px;
    left: 295px;
    height: 578px;
    font-size: 12px;
    color: #b5b5c3;
    position: relative;
    background: #28466a;
    overflow: auto;
    border: 0px solid black;
   
  }
 
  .loadsuite-table {
    width: 100%;
    border-collapse: separate;
    padding: 18px 18px;
    border-spacing: 0px;
  }
  .loadsuite-table th,
  .loadsuite-table td {
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
  }
 
  .bg-null { background-color: #ffffff; width: 100%; height: 100%; display: block; }
  .bg-success {
     background-color: #008000 !important;
     width: 100%;
     height: 100%;
     display: block;
  }
  .bg-failed{ background-color: #ff0000; width: 100%; height: 100%; display: block; }
 
.loadsuite-title{
  text-align: left !important;
}
 .loadsuite-table thead th{
  position: sticky;
  top: 0px !important;
  z-index: 1;
  background: #28466a;
}
  </style>
  
  
