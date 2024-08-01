<template>
    <div class="side-left-menu">
      <!-- <img class="abort-icon" alt="" src="/images/abort@2x.png" /> -->
      <div :class="isAborted == 'true' ? 'aborted-icon' : 'abort-icon'" @click="toggleAbort"><span class="tooltiptext">{{tooltipText }}</span><i class="fa-solid fa-ban" style="color:white;font-size: 20px;"></i></div>
      <!-- <img class="pause-icon" alt="" src="/images/pause@2x.png" /> -->
      <div class="pause-icon" ><span class="tooltiptext">Pause Suite</span><i class="fa-solid fa-pause" style="color:white;font-size: 20px;"></i></div>
      <!-- <img class="restart-icon" alt="" src="/images/restart@2x.png" /> -->
      <div class="restart-icon" ><span class="tooltiptext">Restart Suite</span><i class="fa fa-refresh" aria-hidden="true" style="color:white;font-size: 20px;"></i></div>
      <!-- <img class="run-suite-icon" alt="" src="/images/run-suite@2x.png" /> -->
      <div class="run-suite-icon"><span class="tooltiptext">Run Suite</span><i class="fas fa-running" @click ="handleRunSuite" style="color:white;font-size: 20px;"></i></div>
      <div class="logs1-icon"><span class="tooltiptext">Logs</span><img class="logs-icon" alt="" src="/images/logs@2x.png" @click="handleShowLogs"/></div>
      <div class="explore1-icon"><span class="tooltiptext">Explore</span><img class="explore-icon" alt="" src="/images/explore@2x.png"  /></div>
      <div class="terminal-icon" @click="openWebShell" target="_blank" style="background-color: #001733; color: white;" ><span class="tooltiptext">Open WebShell</span><i class="fa-solid fa-terminal" style="font-size: 20px;"></i></div>
      <div class="config-icon" @click="openConfig()" style="background-color: #001733; color: white;"><span class="tooltiptext">Config</span><i class="fa-solid fa-gears" style="font-size: 20px;"></i></div>
    </div>
    <div class="sub-header">
      <div class="sub-header-child" >
        <span :class="showActionPane ? 'right-icon' : 'right-icon-enabled'" @click="handleActionPane"><i class="pi pi-angle-double-right" style="color:white" ></i></span>
      </div>

    </div>
    <div class="card flex justify-center">
    <Dialog v-model:visible="visible" modal header="Config Settings" :style="{ width: '32rem', height: '15rem' }">
      <div class="form-check form-switch">
        <input class="form-check-input form-config-toggle" ref="pauseonfail" type="checkbox" role="switch" v-model="pauseOnFail" :checked="pauseOnFail">
        <label class="form-check-label" for="flexSwitchCheckDefault">Pause on Fail</label>
      </div>
      <!-- <span class="text-surface-500 dark:text-surface-400 block gap-4 mb-8">Abort on Fail</span> -->
      <div class="form-check form-switch">
        <input class="form-check-input form-config-toggle" ref="abortonfail" type="checkbox" role="switch" v-model="abortOnFail" :checked="abortOnFail">
        <label class="form-check-label" for="flexSwitchAbortOnFail">Abort on Fail</label>
      </div>
      <!-- <span class="text-surface-500 dark:text-surface-400 block gap-4 mb-8">Single step</span> -->
      <div class="form-check form-switch">
        <input class="form-check-input form-config-toggle" ref="singleStep" type="checkbox" role="switch" v-model="singleStep" :checked="singleStep">
        <label class="form-check-label" for="flexSwitchSingleStep">Single step</label>
      </div>
      <div class="button-div" style="margin-top: 9px;">
        <button @click="closeConfig" type="button" class="btn btn-secondary">
          Cancel
        </button>

        <button type="button" class="btn btn-primary" @click="saveConfigSettings()" style="margin-left: 10px;">
          Save
        </button>


    </div>
  </Dialog>
</div>
</template>

<script>
import 'primeicons/primeicons.css'
export default {
name: 'SideMenu',
data() {
  return {
    showActionPane: true,
    showLogs: true,
    runSuite: true,
    isRunSuiteStarted: false,
    visible: false,
    pauseOnFail: false,
    abortOnFail: false,
    singleStep: false,
    isAborted: localStorage.getItem('isSuiteAborted') || "false",
    tooltipText: localStorage.getItem('isSuiteAborted') == "true" ? 'Abort Clear' : 'Abort Suite',
  };
},
mounted() {
  if (localStorage.isSuiteAborted) {
    this.isAborted = localStorage.isSuiteAborted;
  }
},
watch: {
  isAborted(newVal) {
    localStorage.isSuiteAborted = newVal;
    this.isAborted = localStorage.isSuiteAborted;
    //localStorage.setItem('isSuiteAborted', JSON.stringify(newVal));
    this.tooltipText = this.isAborted == 'true' ? 'Abort Clear' : 'Abort Suite';
  }
},
methods: {
  toggleAbort() {
    if (this.isAborted == "true") {
      this.isAborted = "false"
      this.$toast.add({ severity: 'success', summary: 'Information', detail: 'Abort Cleared', life: 5000 });
    } else {
      this.isAborted = "true"
      this.$toast.add({ severity: 'info', summary: 'Information', detail: 'Aborting started', life: 5000 });     
    }
  },
  openWebShell() {
    const loggerURL = this.$router.resolve({ name: 'Webshell' }).href;
    window.open(loggerURL, '_blank');
  },
  handleShowLogs() {
    this.isRunSuiteStarted = true;
    if (this.showLogs === false) {
      this.showLogs = true
    }
    else {
      this.showLogs = false
    }
    this.$emit("showLogs", this.showLogs)
  },
  handleRunSuite() {
    this.$emit("runSuite", this.runSuite);
  },
  abortSuite() {
    this.$toast.add({ severity: 'info', summary: 'Information', detail: 'Aborting started', life: 5000 });
    localStorage.setItem("isSuiteAborted", true);
  },
  handleActionPane() {
    if (this.showActionPane === false)
      this.showActionPane = true;
    else {
      this.showActionPane = false;
    }
    this.$emit("showActionPanel", this.showActionPane);
  },
  openConfig() {
    this.visible = true;
    this.pauseOnFail = (localStorage.getItem("pauseOnFail") == 'true' ? true : false);
    this.abortOnFail = (localStorage.getItem("abortOnFail") == 'true' ? true : false);
    this.singleStep = (localStorage.getItem("singleStep") == 'true' ? true : false);
  },
  saveConfigSettings() {
    localStorage.setItem('pauseOnFail', this.pauseOnFail);
    localStorage.setItem('abortOnFail', this.abortOnFail);
    localStorage.setItem('singleStep', this.singleStep);
    this.visible = false;
    this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Config setting changed successfully', life: 3000 });
  },
  closeConfig() {
    this.visible = false;
  },
  getAbortStatus() {
    this.isAborted = localStorage.getItem('isSuiteAborted');
  }
},
};
</script>

<style scoped>
:deep(.form-config-toggle) {
background-color: #cdc1c1 !important;
}

.aborted-icon:hover .tooltiptext {
visibility: visible;
}

.aborted-icon .tooltiptext {
visibility: hidden;
width: 140px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 7px;
left: 34px;
}

.aborted-icon {
position: absolute;
top: 26.5%;
/* left: 10px; */
width: 100%;
height: 28px;
background-color: red;
display: grid;
align-items: center;
object-fit: cover;
padding-left: 11px;
}

.span {
color: #e3e3e3;
}

.background-rectangle-icon {
position: absolute;
height: 100%;
top: 0%;
bottom: 0%;
left: 0px;
max-height: 100%;
width: 1206px;
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
width: 1206px;
color: #8b99ab;
}

.background-rectangle-icon2 {
position: absolute;
height: 100%;
top: 0%;
bottom: 0%;
left: 0px;
max-height: 100%;
width: 261px;
}

.group-item {
position: absolute;
top: 0px;
left: 0px;
border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);
box-sizing: border-box;
width: 261px;
height: 25px;
}

.action-settings {
position: absolute;
top: 3px;
left: 18px;
}

.text-01 {
position: absolute;
top: 3px;
left: 161px;
}

.group-inner {
position: absolute;
top: 25px;
left: 0px;
border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);
box-sizing: border-box;
width: 261px;
height: 25px;
}

.action-settings1 {
position: absolute;
top: 28px;
left: 18px;
}

.text-011 {
position: absolute;
top: 28px;
left: 161px;
}

.rectangle-div {
position: absolute;
top: 50px;
left: 0px;
border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);
box-sizing: border-box;
width: 261px;
height: 25px;
}

.group-child1 {
position: absolute;
top: 79px;
left: 173px;
background-color: #51bd2b;
width: 16px;
height: 16px;
display: none;
}

.last-update {
position: absolute;
top: 53px;
left: 18px;
}

.right-icon {
position: absolute;
margin-top: 0.5%;
margin-left: 98%;
}

.right-icon-enabled {
position: absolute;
margin-top: 0.5%;
margin-left: 82%;
}

.div {
position: absolute;
top: 53px;
left: 161px;
}

.group-child2 {
position: absolute;
top: 75px;
left: 0px;
border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);
box-sizing: border-box;
width: 261px;
height: 25px;
}

.status {
position: absolute;
top: 78px;
left: 18px;
}

.rectangle-group {
position: absolute;
top: 34px;
left: 0px;
width: 261px;
height: 100px;
}

.property-window-child {
position: absolute;
top: 0px;
left: 0px;
background-color: #0b2340;
width: 261px;
height: 29px;
}

.apps-icon {
position: absolute;
top: 5px;
left: 30px;
width: 18px;
height: 18px;
object-fit: cover;
}

.doorbell-icon {
position: absolute;
top: 5px;
left: 56px;
width: 18px;
height: 18px;
object-fit: cover;
}

.property-icon {
position: absolute;
top: 5px;
left: 4px;
width: 18px;
height: 18px;
object-fit: cover;
}

.property-window {
position: absolute;
height: 49.66%;
top: 8.82%;
bottom: 41.52%;
left: 1239px;
width: 261px;
}

.data-table-child {
position: absolute;
top: 0px;
left: 1px;
background-color: #fff;
width: 945px;
height: 580px;
}

.button-trash-icon {
position: absolute;
top: 0px;
right: 0.01px;
width: 32.4px;
height: 32px;
}

.button-edit-icon {
position: absolute;
top: 0px;
right: 42.6px;
width: 32.4px;
height: 32px;
}

.button-settings-icon {
position: absolute;
top: 0px;
right: 85.19px;
width: 32.4px;
height: 32px;
object-fit: cover;
display: none;
}

.row-18 {
position: absolute;
top: 0px;
right: 0.08px;
width: 75px;
height: 32px;
}

.configure-rd20-card {
position: absolute;
top: 0px;
right: 0px;
line-height: 160%;
display: inline-block;
width: 489.7px;
height: 24px;
}

.item-9 {
position: absolute;
top: 4px;
right: 321.51px;
width: 489.7px;
height: 24px;
}

.div1 {
position: absolute;
top: 6px;
left: 0px;
font-weight: 600;
color: #000;
display: inline-block;
width: 15.2px;
}

.progress-child {
position: absolute;
top: 0px;
right: 0px;
border-radius: 5px;
background-color: #07aa07;
width: 102px;
height: 32px;
}

.completed {
position: absolute;
top: 7px;
left: 17px;
}

.progress {
position: absolute;
top: 0px;
right: 135.36px;
width: 102px;
height: 32px;
font-size: 12px;
color: #fff;
}

.data-row-10 {
position: absolute;
top: 534px;
right: 49.64px;
width: 869px;
height: 32px;
color: #23293d;
}

.progress1 {
position: absolute;
top: 0px;
right: 185px;
width: 102px;
height: 32px;
font-size: 12px;
}

.row-17 {
position: absolute;
top: 1px;
right: 49.71px;
width: 75px;
height: 32px;
}

.sep {
position: absolute;
width: 100%;
top: 43px;
right: 0px;
left: 0px;
border-radius: 6px;
background-color: #e5eaee;
height: 1px;
}

.item-8 {
position: absolute;
top: 5px;
right: 371.14px;
width: 489.7px;
height: 24px;
color: #23293d;
}

.div2 {
position: absolute;
top: 7px;
left: 26.36px;
font-weight: 600;
color: #000;
display: inline-block;
width: 9.1px;
}

.data-row-09 {
position: absolute;
top: 481px;
right: 0px;
width: 945px;
height: 44px;
}

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

.row-16 {
position: absolute;
top: 0px;
right: 49.71px;
width: 75px;
height: 32px;
}

.sep1 {
position: absolute;
width: 100%;
top: 42px;
right: 0px;
left: 0px;
border-radius: 6px;
background-color: #e5eaee;
height: 1px;
}

.item-7 {
position: absolute;
top: 4px;
right: 371.14px;
width: 489.7px;
height: 24px;
color: #23293d;
}

.div3 {
position: absolute;
top: 6px;
left: 26.36px;
font-weight: 600;
color: #000;
display: inline-block;
width: 9.1px;
}

.data-row-08 {
position: absolute;
top: 430px;
right: 0px;
width: 945px;
height: 43px;
}

.div4 {
position: absolute;
top: 6px;
left: 26.36px;
font-weight: 600;
color: #000;
display: inline-block;
width: 8.1px;
}

.data-row-07 {
position: absolute;
top: 378px;
right: 0px;
width: 945px;
height: 43px;
}

.data-row-06 {
position: absolute;
top: 326px;
right: 0px;
width: 945px;
height: 43px;
}

.progress-child3 {
position: absolute;
top: 0px;
right: 0px;
border-radius: 5px;
background-color: #ffa500;
width: 102px;
height: 32px;
}

.error {
position: absolute;
top: 7px;
left: 37px;
}

.div6 {
position: absolute;
top: 6px;
left: 26.36px;
font-weight: 600;
color: #000;
display: inline-block;
width: 10.1px;
}

.data-row-05 {
position: absolute;
top: 274px;
right: 0px;
width: 945px;
height: 43px;
}

.progress-child4 {
position: absolute;
top: 0px;
right: 0px;
border-radius: 5px;
background-color: #e0e017;
width: 102px;
height: 32px;
}

.resume {
position: absolute;
top: 7px;
left: 27px;
}

.data-row-04 {
position: absolute;
top: 223px;
right: 0px;
width: 945px;
height: 43px;
}

.data-row-03 {
position: absolute;
width: calc(100% - 1px);
top: 171px;
right: 0px;
left: 1px;
height: 43px;
}

.data-row-02 {
position: absolute;
width: calc(100% - 1px);
top: 120px;
right: 0px;
left: 1px;
height: 43px;
}

.sep8 {
position: absolute;
width: 100%;
top: 41px;
right: 0px;
left: 0px;
border-radius: 6px;
background-color: #e5eaee;
height: 1px;
}

.connect-to-g32 {
position: absolute;
top: 0px;
right: 0px;
line-height: 160%;
display: inline-block;
width: 404.6px;
height: 24px;
}

.item-1 {
position: absolute;
top: 4px;
right: 456.24px;
width: 404.6px;
height: 24px;
color: #23293d;
}

.div10 {
position: absolute;
top: 6px;
left: 26.36px;
font-weight: 600;
color: #000;
display: inline-block;
width: 6.1px;
}

.data-row-01 {
position: absolute;
width: calc(100% - 1px);
top: 70px;
right: 0px;
left: 1px;
height: 42px;
}

.sep9 {
position: absolute;
width: 100%;
top: 26px;
right: 0px;
left: 0px;
border-radius: 6px;
background-color: #e5eaee;
height: 2px;
}

.run {
position: absolute;
top: 0px;
right: 0px;
letter-spacing: 0.03em;
font-weight: 600;
display: flex;
align-items: center;
width: 160.2px;
height: 18px;
}

.title {
position: absolute;
top: 0px;
right: 49.69px;
width: 160.2px;
height: 18px;
text-align: right;
}

.reps {
position: absolute;
top: 1px;
right: 54.75px;
letter-spacing: 0.03em;
font-weight: 600;
display: flex;
align-items: center;
width: 232.2px;
height: 18px;
}

.title2 {
position: absolute;
top: 0px;
right: 0px;
letter-spacing: 0.03em;
font-weight: 600;
display: flex;
align-items: center;
width: 232.2px;
height: 18px;
}

.title1 {
position: absolute;
top: 0px;
right: 628.64px;
width: 232.2px;
height: 18px;
}

.row {
position: absolute;
top: 0px;
left: 0px;
letter-spacing: 0.03em;
font-weight: 600;
display: flex;
align-items: center;
width: 160.2px;
height: 18px;
}

.title3 {
position: absolute;
top: 0px;
left: 0px;
width: 160.2px;
height: 18px;
}

.col-1 {
position: absolute;
top: 0px;
left: 28.39px;
width: 160.2px;
height: 18px;
}

.group-child3 {
position: absolute;
height: 100%;
width: 100%;
top: 0%;
right: 0%;
bottom: 0%;
left: 0%;
background-color: #002451;
}

.file-name-inner {
position: absolute;
height: 100%;
width: 100%;
top: 0%;
right: 0%;
bottom: 0%;
left: 0%;
}

.af {
position: relative;
font-weight: 500;
}

.action-01 {
position: relative;
color: #fff;
}

.af-parent {
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
gap: 4px;
}

.cross-4-1 {
width: 15px;
position: relative;
height: 15px;
overflow: hidden;
flex-shrink: 0;
}

.frame-parent {
position: absolute;
height: 69.57%;
width: 91.74%;
top: 17.39%;
right: 3.67%;
bottom: 13.04%;
left: 4.59%;
background-color: #002451;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
}

.file-name {
position: absolute;
height: 3.97%;
width: 11.52%;
top: 0%;
right: 88.48%;
bottom: 96.03%;
left: 0%;
font-size: 12px;
color: #519ab3;
}

.data-table {
position: absolute;
top: 103px;
left: 293px;
width: 946px;
height: 580px;
font-size: 14px;
}

.background-rectangle-icon3 {
position: absolute;
height: 100%;
top: 0%;
bottom: 0%;
left: 0px;
max-height: 100%;
width: 251px;
}

.folder-structure-child {
position: absolute;
top: 368px;
left: 0px;
background-color: #1a304d;
width: 251px;
height: 60px;
}

.arrow-1-1 {
position: absolute;
top: 0px;
left: 0px;
width: 25px;
height: 25px;
overflow: hidden;
}

.solutions-details {
position: absolute;
top: 3.5px;
left: 26px;
font-weight: 500;
}

.add-file-1-icon {
width: 16px;
position: relative;
height: 16px;
overflow: hidden;
flex-shrink: 0;
}

.refresh-1-icon {
width: 16.8px;
position: relative;
height: 16.8px;
overflow: hidden;
flex-shrink: 0;
object-fit: contain;
}

.add-file-1-parent {
position: absolute;
top: 4.11px;
left: 151.39px;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
gap: 9px;
}

.solution-details-01 {
position: absolute;
top: 0px;
left: 0px;
width: 243.2px;
height: 25px;
}

.vector-icon5 {
position: absolute;
height: 2.44%;
width: 2.18%;
top: 8.09%;
right: 85.61%;
bottom: 89.47%;
left: 12.21%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
object-fit: contain;
}

.solution-undefined {
position: absolute;
top: 30.61px;
left: 48.94px;
}

.vector-icon6 {
position: absolute;
height: 2.44%;
width: 2.18%;
top: 15.43%;
right: 85.61%;
bottom: 82.13%;
left: 12.21%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
object-fit: contain;
}

.solution-undefined-02 {
position: absolute;
top: 61.83px;
left: 48.94px;
}

.vector-icon7 {
position: absolute;
height: 2.44%;
width: 2.18%;
top: 22.77%;
right: 85.61%;
bottom: 74.79%;
left: 12.21%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
object-fit: contain;
}

.solution-undefined-03 {
position: absolute;
top: 93.05px;
left: 48.94px;
}

.vector-icon8 {
position: absolute;
height: 2.44%;
width: 2.18%;
top: 30.11%;
right: 85.61%;
bottom: 67.45%;
left: 12.21%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
object-fit: contain;
}

.solution-undefined-04 {
position: absolute;
top: 124.26px;
left: 48.94px;
}

.vector-icon9 {
position: absolute;
height: 1.27%;
width: 4.32%;
top: 38.07%;
right: 84.46%;
bottom: 60.66%;
left: 11.22%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
object-fit: contain;
}

.solution-undefined-05 {
position: absolute;
top: 155.68px;
left: 49.33px;
}

.arrow-1-11 {
width: 25.2px;
position: relative;
height: 25.2px;
overflow: hidden;
flex-shrink: 0;
object-fit: contain;
}

.solution-undefined-06 {
position: relative;
}

.arrow-1-1-parent {
position: absolute;
top: 183.48px;
left: 19.72px;
width: 135px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 4px;
}

.arrow-1-12 {
position: absolute;
top: 214.48px;
left: 49.72px;
width: 25.2px;
height: 25.2px;
overflow: hidden;
object-fit: contain;
}

.gui-test-1 {
position: absolute;
top: 218.09px;
left: 78.94px;
}

.key-1-icon {
width: 17px;
position: relative;
height: 17px;
overflow: hidden;
flex-shrink: 0;
}

.key-1-parent {
position: absolute;
top: 242px;
left: 69.72px;
width: 135px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 4px;
}

.parent {
position: absolute;
top: 264px;
left: 69.72px;
width: 135px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 4px;
color: #cbcb41;
}

.important-1-parent {
position: absolute;
top: 286px;
left: 69.72px;
width: 135px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 4px;
}

.line-icon {
position: absolute;
top: 208px;
left: 39.72px;
width: 1px;
height: 96px;
object-fit: contain;
}

.vector-icon10 {
position: absolute;
height: 2.44%;
width: 2.18%;
top: 74.62%;
right: 85.61%;
bottom: 22.94%;
left: 12.21%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
object-fit: contain;
}

.solution-undefined-07 {
position: absolute;
top: 313.61px;
left: 48.94px;
}

.vector-icon11 {
position: absolute;
height: 2.44%;
width: 2.18%;
top: 81.95%;
right: 85.61%;
bottom: 15.6%;
left: 12.21%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
object-fit: contain;
}

.solution-undefined-08 {
position: absolute;
top: 344.83px;
left: 48.94px;
}

.arrow-1-13 {
position: absolute;
top: 369px;
left: 0.76px;
width: 25.2px;
height: 25.2px;
overflow: hidden;
object-fit: contain;
}

.unknown-01 {
position: absolute;
top: 372.61px;
left: 29.98px;
font-weight: 500;
}

.arrow-1-14 {
position: absolute;
top: 400.22px;
left: 0.76px;
width: 25.2px;
height: 25.2px;
overflow: hidden;
object-fit: contain;
}

.unknown-02 {
position: absolute;
top: 403.83px;
left: 29.98px;
font-weight: 500;
}

.solution-details-01-parent {
position: absolute;
top: 2px;
left: 3.28px;
width: 243.2px;
height: 425.4px;
}

.folder-structure {
position: absolute;
height: 91.18%;
top: 8.82%;
bottom: 0%;
left: 43px;
width: 251px;
}

.side-left-menu-child {
position: absolute;
top: 0px;
left: 0px;
background-color: #001733;
width: 3%;
height: 100%;
}

.abort-icon {
position: absolute;
top: 26.5%;
/* left: 10px; */
width: 100%;
height: 28px;
display: grid;
align-items: center;
object-fit: cover;
padding-bottom: 2.5px;
}

.pause-icon {
position: absolute;
top: 22%;
left: 15px;
width: 18px;
height: 18px;
object-fit: cover;
}

.restart-icon {
position: absolute;
top: 17.5%;
left: 13px;
width: 18px;
height: 18px;
object-fit: cover;
}

.run-suite-icon {
position: absolute;
top: 13%;
left: 13px;
width: 18px;
height: 18px;
object-fit: cover;
}

.logs-icon {
position: absolute;
top: 7%;
left: 9px;
width: 28.2px;
height: 36.2px;
object-fit: contain;
}

.explore-icon {
position: absolute;
top: 2%;
left: 7px;
width: 30px;
height: 25px;
object-fit: cover;
}

.terminal-icon {
position: absolute;
top: 31%;
left: 13px;
width: 18px;
height: 18px;
object-fit: cover;
}

.config-icon {
position: absolute;
top: 35.5%;
left: 9px;
width: 18px;
height: 0px;
}

.side-left-menu {
position: absolute;
top: 103px;
left: 0px;
width: 3%;
height: 100%;
background-color: #001733;
}

.sub-header-child {
top: 0px;
left: 0px;
background-color: #001733;
position: absolute;
width: calc(100% + 1px);
height: 38px;
}

.double-right-icon {
position: absolute;
top: 9px;
left: 1450px;
width: 16px;
height: 16px;
object-fit: cover;
}

.sub-header {
position: absolute;
width: calc(100% + 1px);
top: 65px;
left: 0px;
height: 38px;
background-color: #001733;
}

.background {
position: absolute;
width: 100%;
top: 0px;
right: 0px;
left: 0px;
background-color: #1b1b28;
height: 65px;
}

.settings-icon {
position: absolute;
top: 7px;
right: 185.79px;
width: 19px;
height: 19px;
}

.notifications-icon {
position: absolute;
height: 55.88%;
width: 5.24%;
top: 20.59%;
right: 76.72%;
bottom: 23.53%;
left: 18.04%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
}

.search-icon {
position: absolute;
height: 55.88%;
width: 6%;
top: 20.59%;
right: 94%;
bottom: 23.53%;
left: 0%;
max-width: 100%;
overflow: hidden;
max-height: 100%;
}

.sharad-rathore {
position: absolute;
top: 7px;
right: 38.07px;
font-weight: 500;
display: inline-block;
width: 116px;
}

.users-img-icon {
position: absolute;
top: 0px;
right: 0.02px;
border-radius: 50%;
width: 34px;
height: 34px;
object-fit: cover;
}

.right-menu {
position: absolute;
top: 19px;
right: 30.93px;
width: 316.7px;
height: 34px;
}

.highlighted {
position: absolute;
top: 0px;
left: 0px;
background-color: #272534;
width: 110px;
height: 65px;
}

.file1 {
position: absolute;
top: 23px;
left: 34.35px;
display: inline-block;
width: 21.6px;
}

.path-944-icon {
position: absolute;
top: 29px;
left: 67.04px;
width: 8.6px;
height: 5px;
object-fit: contain;
}

.file {
position: absolute;
top: 0px;
left: 0px;
width: 110px;
height: 65px;
}

.load-app {
position: absolute;
top: 0px;
left: 0px;
display: inline-block;
width: 68.9px;
}

.path-945-icon {
position: absolute;
top: 6px;
left: 69.3px;
width: 8.7px;
height: 5px;
object-fit: contain;
}

.loadapp {
position: absolute;
top: 23px;
left: 126px;
width: 78px;
height: 18px;
}

.help {
position: absolute;
top: 0px;
left: 0px;
display: inline-block;
width: 31px;
}

.chevron-down-icon {
position: absolute;
top: 4px;
left: 47px;
width: 10px;
height: 10px;
object-fit: cover;
}

.apps {
position: absolute;
top: 23px;
left: 251px;
width: 57px;
height: 18px;
}

.top-menu {
position: absolute;
top: 0px;
left: 251px;
width: 308px;
height: 65px;
font-size: 12px;
color: #fff;
}

.logo-icon {
position: absolute;
top: 7px;
left: 25px;
width: 200px;
height: 51.6px;
object-fit: cover;
}

.header {
position: absolute;
width: calc(100% + 1px);
top: 0px;
right: -1px;
left: 0px;
height: 65px;
font-size: 13px;
color: #6c7293;
}

.log-window-v1 {
width: 100%;
position: relative;
background-color: #002451;
height: 1168px;
overflow: hidden;
text-align: left;
font-size: 12px;
color: #fff;
font-family: Poppins;
}

.abort-icon:hover .tooltiptext {
visibility: visible;
}

.abort-icon .tooltiptext {
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 7px;
left: 20px;
}

.pause-icon:hover .tooltiptext {
visibility: visible;
}

.pause-icon .tooltiptext {
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 7px;
left: 20px;
}

.restart-icon:hover .tooltiptext {
visibility: visible;
}

.restart-icon .tooltiptext {
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 7px;
left: 20px;
}

.run-suite-icon:hover .tooltiptext {
visibility: visible;
}

.run-suite-icon .tooltiptext {
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 7px;
left: 20px;
}

.terminal-icon:hover .tooltiptext {
visibility: visible;
}

.config-icon:hover .tooltiptext {
visibility: visible;
}

.config-icon .tooltiptext {
visibility: hidden;
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 7px;
left: 20px;
}

.terminal-icon .tooltiptext {
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 7px;
left: 20px;
}

.logs1-icon:hover .tooltiptext {
visibility: visible;
}

.logs1-icon .tooltiptext {
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 66px;
left: 35px;
}

.explore1-icon:hover .tooltiptext {
visibility: visible;
}

.explore1-icon .tooltiptext {
visibility: hidden;
width: 120px;
background-color: black;
color: #fff;
text-align: center;
border-radius: 6px;
padding: 5px 0;

/* Position the tooltip */
position: absolute;
z-index: 1;
top: 30px;
left: 35px;
}
</style>