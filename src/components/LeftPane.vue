<template>

  <div class="leftPane">
    <Tree :value="treeData" :label="nodeLabel"  selectionMode="single" @nodeSelect="onNodeSelect" style=" font-size: 16px; background-color: #1a304d;
    border: none; padding:5px">
      <template #default="{ node }">
        <span
          class="custom-node"
          @mouseenter="showTooltip($event, node.label)"
          @mouseleave="hideTooltip"
        >
          {{ formatLabel(node.label) }}
        </span>
      </template>
    </Tree>
    
    <div v-if="tooltipVisible" :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }" class="tooltiptext">
      {{ tooltipContent }}
    </div>

  </div>

</template>


<script>
import Tree from 'primevue/tree';
import axios from 'axios';

export default {
  name: 'LeftPane',
  components: {
    Tree
  },
  props: {
    treeData: {
      type: Array,
      required: true
    }
  },
  updated() {
    this.filteredData = [];
  },
  data() {
    return {
      filteredData: [],
      tooltipVisible: false,
      tooltipX: 0,
      tooltipY: 0,
      tooltipContent: ''
    }
  },
  methods: {
    nodeLabel(node) {
      return node.label || 'Unnamed'; 
    },
    nodeChildren(node) {
      return node.children || []; 
    },
    formatLabel(label) {
      return label.length > 25 ? label.substring(0, 25) + '...' : label;
    },
    customEvent(data, testSuiteUUID) {
      this.filteredData = data.filter(item => item.Title && item.Code).map(item => ({ ...item, status: "0" }));
      this.$emit('emitData', this.filteredData, testSuiteUUID);
    },
    onNodeSelect(node) {
      if (node.label.split(".")[1] === 'xlsx') {
        const url = `http://35.188.41.6:8001/api/bucket_files/?label=${node.parent_path}${node.test_suite_uuid_name}.xlsx`;
        axios.get(url)
          .then(res => {
            const data = JSON.parse(res.data);
            this.customEvent(data, node.test_suite_uuid_name.substring(0, 23));
          })
          .catch(error => {
            console.log("Error in Fetching the left Pane:: ", error);
          });
      } else {
        this.$toast.add({ severity: 'warn', summary: 'Information', detail: 'Not a file', life: 5000 });
      }
    },
    showTooltip(event, label) {
      this.tooltipVisible = true;
      this.tooltipContent = label;
      this.tooltipX = event.clientX + 30; 
      this.tooltipY = event.clientY + 20; 
    },
    hideTooltip() {
      this.tooltipVisible = false;
    },

  }
}
</script>
<style>
.custom-node {
  display: inline-block; /* Ensures the node can have width and height */
  /* Set the desired width */
}
.p-tree .p-tree-container .p-treenode .p-treenode-content {
    padding: 5px !important;
}
.custom-tooltip{
  width: 140px;
  background-color: black;
} 

li{
  line-height:1;
}
.leftPane {
    overflow-y: auto;
    height: 100%;
    font-style: normal;
    font-weight: 100;
    font-size: 12px;
    margin-left: 3%;
    background-color: #1a304d;
    position: absolute;
    top: 103px;
    width: 21%;

}

ul {
  list-style-type: none !important;
  margin-left: -28px;
  color: white;
  line-height: 1;
}

button {
  background-color: #1a304d;
  display: contents;
  margin-top: 10px
}

svg {
  color: white;
  margin-right: 10px;
  display: inline;
  cursor: pointer;
}

span {
  cursor: pointer;
}

.log-window-v1-child {
  position: absolute;
  top: 654px;
  left: 1239px;
  width: 261px;
  height: 29px;
}

.log-window-v1-item {
  position: absolute;
  top: 103px;
  left: 1239px;
  background-color: #1a304d;
  width: 26px;
  height: 29px;
}

.vikashinivikas-mi-notebook-ho {
  position: absolute;
  top: 0px;
  left: 0px;
  font-weight: 600;
  color: #b8f171;
}

.span {
  color: #e3e3e3;
}

.desktopvinitodomy-project {
  position: absolute;
  top: 0px;
  left: 324px;
  font-weight: 500;
  color: #80baff;
}

.na-version {
  position: absolute;
  top: 23px;
  left: 0px;
  font-weight: 500;
}

.you-need-to {
  position: absolute;
  top: 47px;
  left: 0px;
  font-weight: 500;
}

.vikashinivikas-mi-notebook-ho-parent {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 534px;
  height: 65px;
}

.vikashinivikas-mi-notebook-ho1 {
  position: relative;
  font-weight: 600;
}

.p-tooltip {
  background-color: black !important; /* Use !important to override */
  color: #fff !important; /* White text */
  font-size: 14px !important; /* Font size */
   /* Shadow effect */
}

.custom-node {
  display: inline-block;
}

.tooltiptext {
  position: fixed; /* Change to fixed positioning */
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px;
  z-index: 9999; /* Ensure it appears above other elements */
  visibility: visible; /* Always show when visible */
  font-size: medium;
}


</style>


