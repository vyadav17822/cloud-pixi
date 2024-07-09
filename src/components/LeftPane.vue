
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
        this.filteredData = [];
        for (let i=0;i<data.length;i++){
          if(data[i].Title!=null && data[i].Code!=null){
            Object.assign(data[i], {status: "0"});
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
 
    },
    updated(){
      this.filteredData = [];
    },
  }
</script>
<style>
  .leftpane-cls {
    overflow-x: auto;
    height: 578px;
    font-style: normal;
    font-weight: 100;
    font-size: 12px;
    color: #fff;
    margin-left: -22px;
  }
  ul{
    list-style-type: none !important;
  }
  button{
    background-color:  #1a304d;
    display: contents;
    margin-top: 10px
  }
  svg{
    color: white;
    margin-right: 10px;
    display: inline;
    cursor: pointer;
  }
  span {
    cursor: pointer;
  }
</style>
