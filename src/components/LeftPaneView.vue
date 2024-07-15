<template>

    <LeftPane :treeData="jsonData" @emitData="handleEventData" />

</template>

<script>
import LeftPane from './LeftPane.vue';
import axios from 'axios';
export default {
    name: "LeftPaneView",
    components: {
        LeftPane
    },
    data() {
        return {
        loadSuiteData: [],
        jsonData: [],
        
      }
        },
    mounted() {
     this.getLeftPane();
    },
    updated(){
        //console.log("leftpaneview updated");
    },
    methods: {
      
        handleEventData(data){
        this.loadSuiteData=data;
        //console.log ("handle event data " +this.loadSuiteData);
        this.$emit("sendData",this.loadSuiteData);
     
      },
      
      convertWithParentPath(data, parentPath = '') {
        return data.map(item => {
          return {
            ...item,
            parent_path: parentPath,
            children: item.children ? this.convertWithParentPath(item.children, `${parentPath}${item.label}/`) : []
          };
        });
      },
      
      getLeftPane(){
        axios.get('http://35.192.211.225:8001/api/files/?Content-Type=application/json')
        .then(res => {
          //console.log("Result:::: [->]", res.data, typeof res.data);
          let finalRes = this.convertWithParentPath(res.data);
          //console.log("Final Result::: ", finalRes);
          this.jsonData = finalRes;
          //console.log(this.jsonData);
        })
        .catch(error => {
            console.log("Error in Fetching the left Pane:: ", error);
        })
      },
    }
}
</script>

<style scoped>

</style>