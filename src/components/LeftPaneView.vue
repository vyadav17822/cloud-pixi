<template>

    <LeftPane :treeData="finalData" @emitData="handleEventData"  />

</template>

<script>
import LeftPane from './LeftPane.vue';
import axios from 'axios';
export default {
    name: "LeftPaneView",
    props:{
      leftPaneTestSuiteUUID:{
        type:String,
        default:''
      }
    },
    components: {
        LeftPane
    },
    data() {
        return {
        loadSuiteData: [],
        jsonData: [],
        finalData:[],
        
      }
        },
    mounted() {
     this.getLeftPane();
    },
    updated(){
        
    },
    methods: {
      
        handleEventData(data,testSuiteUUID){
        this.loadSuiteData=data;
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

    async fetchFileDetails(node,parentLabel){
        try{
          let apiUrl ='';
          //console.log(node.label);
          //console.log(parentLabel);
          if(parentLabel === 'g30'){
            apiUrl = "http://35.192.211.225:8001/api/latest-file-versions/?Content-Type=application/json&test_suite_uuid="+node.label+"&userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&folder=g30/cli";

          }else if(parentLabel === 'g40'){
            apiUrl = "http://35.192.211.225:8001/api/latest-file-versions/?Content-Type=application/json&test_suite_uuid="+node.label+"&userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&folder=g40/cli";

          }
          let response =await axios.get(apiUrl);
          //console.log(response);
          return response.data.file_details;
        }catch(error){
          console.log('Error fetching file details', error);
        }
      },
      
      async getLeftPane(){
       await axios.get('http://35.192.211.225:8001/api/files/?Content-Type=application/json')
        .then(async res => {
         
          let finalRes = this.convertWithParentPath(res.data);
        
          this.jsonData =finalRes;
          //console.log("Final Result::: ",this.jsonData);
          await this.refreshData();
          //console.log(this.jsonData);
          this.finalData=this.jsonData[0].children;

       
        })
        .catch(error => {
            console.log("Error in Fetching the left Pane:: ", error);
        })
      },

      async updateChildrenLabels(parentNode){
        if (parentNode.children && parentNode.children.length){
          const updatePromises =parentNode.children.map(async(childNode)=>{
            const parentLabel = this.findRelevantParentLabel(parentNode);
            const updatedFileNames= await this.fetchFileDetails(childNode, parentLabel);
            if(updatedFileNames&& Array.isArray(updatedFileNames)){
              let filenames = updatedFileNames[0].test_suite_path.split("/")[8].split(".")[0];
              let parentPath =childNode.parent_path;
              let test_suite_uuid_name = childNode.label;
              childNode.children=updatedFileNames.map(fileName=>({
                label:fileName.test_suite_file_name,
                parent_path:parentPath+test_suite_uuid_name+'/',
                test_suite_uuid_name : filenames,
                children:[]
              }));
            }
          });
          await Promise.all(updatePromises);
          }
      },
      async refreshData(){
        this.findAllCliNodes(this.jsonData).forEach(async (cliNode)=>{
          await this.updateChildrenLabels(cliNode);
        });
      },

      findAllCliNodes(nodes){
        let cliNodes =[];
        nodes.forEach(node=>{
          if(node.label === 'cli'){
            cliNodes.push(node);
          }
          if(node.children && node.children.length){
            cliNodes = cliNodes.concat(this.findAllCliNodes(node.children));
          }
        });
        return cliNodes;
      },

      findNodeByLabel(nodes,label){
        for (const node of nodes){
          if(node.label===label)
          return node;
        if(node.children && node.children.length){
          const result = this.findNodeByLabel(node.children,label);
          if(result)
          return result;
        }
       }
       return null;
      },

      findRelevantParentLabel(node){

        if(node && node.children){
          if(node.label ==='cli'){
            return this.findParentLabel(this.jsonData,node);
          }
          for(const child of node.children){
            const result =this.findRelevantParentLabel(child);
            if(result)
            return result;
          }
        }
        return null;
      },

      findParentLabel(nodes,targetNode){
        for (const node of nodes){
          if (node.children && node.children.includes(targetNode)){
            return node.label;
          }
          if(node.children && node.children.length){
            const result = this.findParentLabel(node.children,targetNode);
            if(result){
              return result;
            }
          }
        }
        return null; 
      },
    }
}
</script>

<style scoped>

</style>