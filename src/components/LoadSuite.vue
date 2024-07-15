<template>
  <!-- <label class="upload-btn">
            <input type="file" @change="handleFileUpload">
            <button @click="uploadFile">Upload</button>
        </label> -->
  <div :class="showActionPaneEnabled ? 'main-div' : 'main-div-action'">
    <div
      v-if="loadSuiteData"
      :class="showLogsEnabled ? 'table-header' : 'table-header-full'"
    >
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
            <td
              v-else-if="suite.status === '1'"
              style="align-items: center !important"
            >
              <button
                type="button"
                class="btn btn-primary"
                style="background-color: blue; cursor: default"
              >
                Running
              </button>
            </td>
            <td v-else-if="suite.status === '2'">
              <button
                type="button"
                class="btn btn-success"
                style="background-color: green; cursor: default"
              >
                Success
              </button>
            </td>
            <td v-else-if="suite.status === '3'">
              <button
                type="button"
                class="btn btn-danger"
                style="background-color: red; cursor: default"
              >
                Failure
              </button>
            </td>
            <td>
              <button
                class="btn btn-primary"
                @click="runCommand(suite)"
                style="background-color: #f3f6f9"
                :disabled="isRunSuiteClicked"
              >
                <i
                  class="fa fa-play"
                  aria-hidden="true"
                  style="color: #3699ff; background-color: #f3f6f9"
                ></i>
              </button>
              <button
                class="btn btn-primary"
                @click="showLog"
                style="background-color: #f3f6f9"
              >
                <i
                  class="fas fa-ellipsis-h"
                  aria-hidden="true"
                  style="color: #3699ff; background-color: #f3f6f9"
                ></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="log-window" v-if="showLogsEnabled">
      <div class="group-parent">
        <div class="vikashinivikas-mi-notebook-ho-parent">
          <div class="vikashinivikas-mi-notebook-ho">
            Vikashini@vikas-mi-Notebook-Horizon-edition-15 :
          </div>
          <div class="desktopvinitodomy-project">
            <span>~/desktop/vini/todo/my-project </span>
            <span class="span">$</span>
          </div>
          <div class="na-version">
            N/A : Version “N/A” is not yet installed.
          </div>
          <div class="you-need-to">
            You need to run “nvm install N/A” to install it before using it.
          </div>
        </div>
        <div class="group-wrapper">
          <div class="frame-wrapper">
            <div class="vikashinivikas-mi-notebook-ho-group">
              <div class="vikashinivikas-mi-notebook-ho1">
                Vikashini@vikas-mi-Notebook-Horizon-edition-15 :
              </div>
              <div class="desktopvinitodomy-project1">
                <span>~/desktop/vini/todo/my-project </span>
                <span class="span">$</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="log-header">
        <div class="logs">Logs</div>
        <div class="log-header-child" />
        <img class="vector-icon1" alt="" src="/images/vector1.svg" />
        <img class="vector-icon2" alt="" src="/images/vector2.svg" />
        <img class="vector-icon3" alt="" src="/images/vector3.svg" />
        <img class="vector-icon4" alt="" src="/images/vector4.svg" />
      </div>
    </div>
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
}
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
      alert("Show Log:");
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
  height: 75%;
  font-size: 12px;
  color: #b5b5c3;
  position: relative;
  background: #28466a;
  overflow: auto;
  border: 0px solid black;
}
.table-header-full {
  height: 100%;
  font-size: 12px;
  color: #b5b5c3;
  position: relative;
  background: #28466a;
  overflow: auto;
  border: 0px solid black;
}
.blank {
  height: 35%;
}
.table {
  width: 100%;
  padding: 18px 18px;
}
.table th,
.table td {
  padding: 8px;
  text-align: left;
  vertical-align: middle;
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

.you-need-to {
  position: absolute;
  top: 47px;
  left: 0px;
  font-weight: 500;
}

.vikashinivikas-mi-notebook-ho1 {
  position: relative;
  font-weight: 600;
}
.desktopvinitodomy-project1 {
  position: relative;
  font-weight: 500;
  color: #80baff;
}
.vikashinivikas-mi-notebook-ho-group {
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 3px;
}
.frame-wrapper {
  width: 531px;
  position: relative;
  height: 18px;
}
.group-wrapper {
  position: absolute;
  top: 70px;
  left: 0px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  color: #b8f171;
}

.background-rectangle-icon {
  position: absolute;
  height: 100%;
  top: 0%;
  bottom: 0%;
  left: 0px;
  max-height: 100%;
  width: 100%;
}
.background-rectangle-icon1 {
  position: absolute;
  height: 100%;
  top: 0%;
  bottom: 0%;
  left: 0px;
  max-height: 100%;
  width: 58px;
}
.logs {
  position: absolute;
  top: 6px;
  left: 14px;
  display: inline-block;
  width: 90px;
}
.log-header-child {
  position: absolute;
  top: 30px;
  left: 0px;
  border-top: 1px solid #fff;
  box-sizing: border-box;
  width: 59px;
  height: 1px;
}
.group-child {
  position: absolute;
  top: 0px;
  left: 0px;
  border-radius: 1px;
  border: 1px solid #fff;
  box-sizing: border-box;
  width: 16.3px;
  height: 18px;
}
.vector-icon {
  position: absolute;
  height: 41.11%;
  width: 20.86%;
  top: 25.63%;
  right: 39.62%;
  bottom: 33.26%;
  left: 39.52%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  object-fit: contain;
}
.rectangle-parent {
  position: absolute;
  top: 6px;
  left: 1085px;
  width: 16.3px;
  height: 18px;
}
.vector-icon1 {
  position: absolute;
  height: 12.67%;
  width: 0.56%;
  top: 43.11%;
  right: 6.83%;
  bottom: 44.22%;
  left: 92.61%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  object-fit: contain;
}
.vector-icon2 {
  position: absolute;
  height: 41.33%;
  width: 0.74%;
  top: 30%;
  right: 4.95%;
  bottom: 28.67%;
  left: 94.31%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.vector-icon3 {
  position: absolute;
  height: 12.33%;
  width: 0.56%;
  top: 44.36%;
  right: 3.17%;
  bottom: 43.31%;
  left: 96.27%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  object-fit: contain;
}
.vector-icon4 {
  position: absolute;
  height: 33.33%;
  width: 0.77%;
  top: 33.33%;
  right: 1.25%;
  bottom: 33.33%;
  left: 97.98%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.log-header {
  position: absolute;
  height: 22.06%;
  top: 0%;
  bottom: 77.94%;
  left: 0px;
  width: 100%;
  color: #8b99ab;
}

.na-version {
  position: absolute;
  top: 23px;
  left: 0px;
  font-weight: 500;
}
.log-window {
  position: relative;
  height: 25%;
  background-color: #1a304d;
}
.span {
  color: #e3e3e3;
}
.group-parent {
  position: absolute;
  top: 48px;
  left: 14px;
  width: 100%;
  height: 88px;
  overflow-y: auto;
}
.vikashinivikas-mi-notebook-ho-parent {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 534px;
  height: 65px;
}
.vikashinivikas-mi-notebook-ho {
  position: absolute;
  top: 0px;
  left: 0px;
  font-weight: 600;
  color: #b8f171;
}
.desktopvinitodomy-project {
  position: absolute;
  top: 0px;
  left: 324px;
  font-weight: 500;
  color: #80baff;
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

.main-div-action {
  width: 60%;
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
