<template>
  <!-- <label class="upload-btn">
            <input type="file" @change="handleFileUpload">
            <button @click="uploadFile">Upload</button>
        </label> -->
  <div :class="showActionPaneEnabled ? 'main-div' : 'main-div-action'">
    <ScrollPanel v-if="loadSuiteData" :class="showLogsEnabled ? 'table-header' : 'table-header-full'">
      <table class="table">
        <thead>
          <tr class="table-head" style="font-size: 16px">
            <!-- <th v-for="(cell, index) in data[0]" :key="index">{{ cell }}</th> -->
            <th>Row</th>
            <th style="text-align: left">Title</th>
            <th>Reps</th>
            <th>Status</th>
            <th>Run</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(suite, row) in loadSuiteData" :key="row">
            <td class="table-row-number" style="text-align: center">
              {{ row + 1 }}
            </td>
            <td class="table-row-number" style="text-align: left">
              <span class="loadsuite-title">{{ suite.Title }}</span>
            </td>
            <td></td>
            <td v-if="suite.status === '0'"></td>
            <td v-else-if="suite.status === '1'" style="align-items: center !important">
              <button type="button" class="btn btn-primary" style="background-color: blue; cursor: default">
                Running
              </button>
            </td>
            <td v-else-if="suite.status === '2'">
              <button type="button" class="btn btn-success" style="background-color: green; cursor: default">
                Success
              </button>
            </td>
            <td v-else-if="suite.status === '3'">
              <button type="button" class="btn btn-danger" style="background-color: red; cursor: default">
                Failure
              </button>
            </td>
            <td>
              <button class="btn btn-primary" @click="runCommand(suite)" style="background-color: #f3f6f9"
                :disabled="isRunSuiteClicked">
                <i class="fa fa-play" aria-hidden="true" style="color: #3699ff; background-color: #f3f6f9"></i>
              </button>
              <button class="btn btn-primary" @click="showLog" style="background-color: #f3f6f9">
                <i class="fas fa-ellipsis-h" aria-hidden="true" style="color: #3699ff; background-color: #f3f6f9"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </ScrollPanel>
  </div>
</template>

<script>
// import * as XLSX from 'xlsx';
// import axios from 'axios';

export default {
  name: "LoadSuits",
  props: {
    loadSuiteData: {
      type: Array,
      required: true,
    },
    // eslint-disable-next-line vue/require-prop-type-constructor
    showActionPaneEnabled: true,
    // eslint-disable-next-line vue/require-prop-type-constructor
    showLogsEnabled: true,
    isRunSuiteClicked: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      uploadedFile: null,
      fileToUpload: null,
      data: null,
      key: 1,
      rowsStatus: [],
      filteredData: [],
    };
  },
  created() {
    //console.log("Load suite data:: ", this.loadSuiteData);
    //console.log("showActionPane" + this.showActionPaneEnabled);
    //console.log("showActionPane" + this.showLogsEnabled);
    
  },
  methods: {
    async runCommand(suite) {
      let command = suite.Code;
      suite.status = "1";
      try {
        let res = await this.$runSuiteCommand(command);
        //console.log("Result: in run suite: ", res);
        suite.status = "2";
        if (res.status == "200") {
          suite.status = "2";
        } else {
          suite.status = "3";
        }
      } catch (error) {
        suite.status = "3";
      }
    },

    showLog() {
      this.$toast.add({ severity: 'info', summary: 'Information', detail: 'Show Logs', life: 3000 });
    },
  },
};
</script>

<style scoped>
.loadsuite-title {
  top: 0px;
  right: 0px;
  display: inline-block;
  height: 24px;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #fff;
  text-align: center;
}

.table-row-number {
  position: relative;
  font-family: Poppins;
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.table-header {
  height: 60%;
  font-size: 12px;
  color: #b5b5c3;
  position: relative;
  background: #28466a;
  /* overflow: auto; */
  border: 0px solid black;
}

.table-header-full {
  height: 100%;
  font-size: 12px;
  color: #b5b5c3;
  position: relative;
  background: #28466a;
  /* overflow: auto; */
  border: 0px solid black;
}

.blank {
  height: 35%;
}

.table {
  width: 97%;
  padding: 18px 18px;
  margin-left: 1%;
  margin-right: 2%
}
.table th,
.table tr{
  border-bottom: 1px solid white;
}
.table th,
.table td {
  padding: 8px;
  text-align: left;
  vertical-align: middle;
  color: white;
}

.bg-null {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: block;
  cursor: default;
}

.bg-success {
  background-color: #008000 !important;
  width: 100%;
  height: 100%;
  display: block;
  cursor: default !important;
}

.bg-failed {
  background-color: #ff0000;
  width: 100%;
  height: 100%;
  display: block;
}

.loadsuite-title {
  text-align: left !important;
}

.table-head {
  position: sticky;
  top: 0px !important;
  z-index: 1;
  background: #28466a;
  border-color: inherit;
  box-sizing: border-box;
}

.log-window {
  position: relative;
  height: 25%;
  background-color: #1a304d;
}

.main-div {
  width: 76%;
  top: 103px;
  height: 100%;
  font-size: 12px;
  color: #b5b5c3;
  position: absolute;
  background: #28466a;
  border: 0px solid black;
  margin-left: 24%;
}
.table thead th{
  border-top: 0px;
  border-bottom:1px solid white;
}

.main-div-action {
  width: 57%;
  top: 103px;
  height: 100%;
  font-size: 12px;
  color: #b5b5c3;
  position: absolute;
  background: #28466a;
  border: 0px solid black;
  margin-left: 24%;
}
</style>
