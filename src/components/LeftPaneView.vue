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
      
        handleEventData(data,testSuiteUUID){
        this.loadSuiteData=data;
        //console.log ("handle event data " +this.loadSuiteData);
        this.$emit("sendData",this.loadSuiteData,testSuiteUUID);
     
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

      updateCliChildren(data,directoryName,fileDetails){
       const filenames = fileDetails[0].test_suite_path.split("/")[8].split(".")[0];
      console.log("filenames", filenames);
        const updateChildren=(children) =>{
          children.forEach(child =>{
            if(child.name === directoryName){
              const parentPath =child.parent_path;
              const test_suite_uuid_name = child.label;
              //console.log (parentPath);
              //console.log(fileDetails);
              child.children =fileDetails.map(file=>({
                label:file.test_suite_file_name,
                parent_path:parentPath+test_suite_uuid_name+'/',
                test_suite_uuid_name : filenames,
                children:[]
              }));
            }
            else if(child.children){
              updateChildren(child.children);
            }
          });
        };
        const updatedData = JSON.parse(JSON.stringify(data));
        updateChildren(updatedData.children);
        return updatedData;
      },
      async fetchAndUpdateFileDetails(originalData){
        try{
          await Promise.all(originalData.children.map(async(child)=>{
            if(child.children){
              await Promise.all(child.children.map(async (subchild) =>{
                if(subchild.name === 'cli' && subchild.children){
                  await Promise.all(subchild.children.map(async (subsubchild) =>{
                  const directoryName = child.name;
                  const fileDetails =await this.fetchFileDetails(directoryName);
                 //// console.log(fileDetails);
                  const finalData = this.updateCliChildren(originalData,subsubchild.name, fileDetails);
                  ////console.log(finalData);
                  //console.log(finalData.children);
                  this.jsonData = finalData.children;
              }));
            }
          }));
            }
          }));
        } catch(error){
          console.log('Error fetching file details',error);
        }
      },
      async fetchFileDetails(directoryName){
        try{
          let apiUrl ='';
          if(directoryName === 'g30'){
            apiUrl = "http://35.192.211.225:8001/api/latest-file-versions/?Content-Type=application/json&test_suite_uuid=ae25c605-f9e0-4ac3-bdb3-ebb43b&userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&folder=g30/cli";

          }else if(directoryName === 'g40'){
            apiUrl = "http://35.192.211.225:8001/api/latest-file-versions/?Content-Type=application/json&test_suite_uuid=ae25c605-f9e0-4ac3-bdb3-ebb43b&userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&folder=g40/cli";

          }
          const response = await axios.get(apiUrl);
          //console.log(response);
          return response.data.file_details;
        }catch(error){
          console.log('Error fetching file details', error);
          return [];
        }
      },
      
     async getLeftPane(){
       await axios.get('http://35.192.211.225:8001/api/files/?Content-Type=application/json')
        .then(res => {
          //console.log("Result:::: [->]", res.data, typeof res.data);
          let finalRes = this.convertWithParentPath(res.data);
         // console.log("Final Result::: ", finalRes);
          const originalData = finalRes[0];
          this.fetchAndUpdateFileDetails(originalData);
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