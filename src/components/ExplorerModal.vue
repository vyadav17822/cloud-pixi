<template>
    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal header="Open Folder" :style="{ width: '34rem' }">
      <span class="text-surface-500 dark:text-surface-400 block gap-8 mb-8">Select Folder to open</span>
      <div class="flex items-center gap-4 mb-4" style="margin-top:1.5rem">

        <label for="username" class="font-semibold w-30">Folder</label>

        <Dropdown v-model="selectedFolder" :options="folder" optionLabel="name" placeholder="Select a Folder"
          class="w-full md:w-14rem" style="margin-left: 90px" />

      </div>
      <br/>
      <br/>

      <div class="button-div">
        <Button @click="closeModal" type="button" class="btn btn-secondary">
          Cancel
        </Button>

        <Button type="button" class="btn btn-primary"  @click="folderSelected">
          Open
        </Button>


      </div>
    </Dialog>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                visible:false,
                folder:[ { name: 'G30', code: 'g30' }, { name: 'G40', code: 'g40' }, { name: 'All Folders', code: 'all' }],
                selectedFolder:String,
            };

        },
       methods:{
        open(){
            this.visible=true;
        },
        closeModal(){
            this.visible=false;
        },
        folderSelected(){
            this.$emit("folderSelected",this.selectedFolder.code);
            this.selectedFolder='';
            this.closeModal();
        },
       }, 
    }
</script>

<style scoped>
.button-div{
    float: right
  }

</style>