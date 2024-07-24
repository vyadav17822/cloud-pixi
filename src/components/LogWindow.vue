<template>
  <div class="log-window" v-if="showLogsEnabled">
      <div class="group-parent" id ="log-container">
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
</template>

<script>
import axios from 'axios';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';

const fitAddon = new FitAddon();
const terminal = new Terminal({
  termName: "logWindow",
  cols: 130,
  rows:9,
  screenKeys: true,
  convertEol: true
});

terminal.loadAddon(fitAddon);

export default {
  name: "LogWindow",
  mounted() {
    this.getLogs();
    this.initializeTerminal();
  },

  data() {
    return {
      logsData: null
    };
  },
  props: {
    showLogsEnabled: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    getLogs() {
       axios.get("http://35.192.211.225:8001/api/logs/?Content-Type=application/json").then(
      //axios.get("http://localhost:3003/getlog").then(
        (response) => {
          console.log("Response::: ", response);
          // this.logsData = response.data.logs.join("\n");
          terminal.write(response.data.logs.join());
        }).catch(error => {
          console.log(error);
        })
    },
    initializeTerminal() {
      fitAddon.fit();
      terminal.open(document.getElementById('log-container'));
      terminal.write('Welcome to cpixi \n');
      terminal.write('users@pixi-log$ ');// Display prompt initially
    },
  }
};
</script>
<style>
  
</style>
<style scoped>
:deep(.terminal){
    height: 20vh;
    background-color: #1b1b28;
  }
.log-terminal{
  height: 20px;
}
.textarea {
  color: #fff;
  font-family: 'Poppins';
}

.logs-textarea {
  position: relative;
  height: 166%;
  background-color: #1a304d;
  width: 103%;
  margin-top: -15px;
  margin-left: -15Px;
  color: #fff;
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
  position: absolute;
  top: 88.2%;
  height: 24.6%;
  width: 76%;
  left: 24%;
  background-color: #1a304d;
}

.span {
  color: #e3e3e3;
}

.group-parent {
    position: absolute;
    top: 33px;
    width: 100%;
    height:80%;
    color:#ffff;
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
</style>