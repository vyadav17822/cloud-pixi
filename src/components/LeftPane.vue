
<template>
  <div class="card flex justify-center leftpane-cls">
    <Tree v-model:selectionKeys="selectedKey" :value="treeData" selectionMode="single" @nodeSelect="onNodeSelect"></Tree>
        <!-- <Tree :value="treeData" class="w-full md:w-[30rem]"></Tree> -->

    </div>
</template>


<script>
  import Tree from 'primevue/tree';
  import axios from 'axios';
  
  export default {
    name: 'LeftPane',
    components:{
      Tree
    },
    props: {
      treeData: {
        type: Array,
        required: true
      }
    },
    data(){
      return {
        filteredData:[]
      }
    },
    methods: {
      customEvent(data){
        console.log(data);
        for (let i=0;i<data.length;i++){
          if(data[i].Title!=null && data[i].Code!=null){
            this.filteredData.push(data[i]);
          }
        }
        this.$emit('emitData',this.filteredData);
      },
      onNodeSelect(node) {
        console.log("Checking Clicked node::: ",node.parent_path, node.label);
        if(node.label.split(".")[1] === 'xlsx'){
          let url = 'http://35.192.211.225:8001/api/bucket_files/?label=' +''+ node.parent_path+''+node.label;
          axios.get(url)
          .then(res => {
            console.log("Result:::: [->]", JSON.parse(res.data));
            let data =JSON.parse(res.data);
            console.log(data);
            this.customEvent( JSON.parse(res.data));
           
          })
          .catch(error => {
              console.log("Error in Fetching the left Pane:: ", error);
          })
        } else {
          console.log("Inside the folder structure");
          alert("Not a file")
        }
       
      },
 
    }
  }
</script>
<style scoped>
  .leftpane-cls {
    overflow-x: scroll;
    height: 578px;
    font-style: normal;
    font-weight: 100;
    font-size: 12px;
    color: #fff;
    margin-left: -22px;
  }
</style>
