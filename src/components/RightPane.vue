<template>
    <div v-if="!showActionPaneEnabled" class="rightpaneview">
        <div class="rightpane-header">
            <div class="rightpane" style="font-size: 16px; font-weight: bold; color: white">Properties</div>
        </div>
        <div class="tabview" v-if="showMetaData && (metaData!==undefined ||metaData!==null) && (historicalData!==undefined || historicalData!==null)">
            <TabView class="tabview-custom"  v-if="metaData!==undefined && metadata!==null">
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="fa-solid fa-user" style="color:white;font-size: 21px;"></i>
                        </div>
                    </template>
                    <p class="m-0">
                    <table class="table" style="width: 100%; table-layout: fixed;"  v-if="metaData!==undefined && metadata!==null">
                        <tbody>
                            <tr>
                                <td>Title</td>
                                <td style="word-wrap: break-word;">{{ metaData.title || "NA" }}</td>
                            </tr>
                            <tr>
                                <td>Owner</td>
                                <td style="word-wrap: break-word;">{{ metaData.owner || "NA" }}</td>
                            </tr>
                            <tr>
                                <td>DOA</td>
                                <td>{{ metaData.doa || "NA" }}</td>
                            </tr>
                            <tr>
                                <td>With_TGEN</td>
                                <td>{{ metaData.with_tgen || "NA" }}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td>{{ metaData.status || "NA" }}</td>
                            </tr>
                            <tr>
                                <td>Product</td>
                                <td>{{ metaData.product || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>Interface</td>
                                <td>{{ metaData.interface || "NA" }}</td>
                            </tr>
                            <tr>
                                <td>Version</td>
                                <td>{{ metaData.software_version || "NA" }}</td>
                            </tr>
                            <tr>
                                <td>Simulator Compatible</td>
                                <td>{{ metaData.simulator_compatible || "NA" }}</td>
                            </tr>
                        </tbody>
                    </table>
                    </p>
                </TabPanel>
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-folder" style="color:white;font-size: 20px;"></i>
                        </div>
                    </template>
                    <p class="m-0">
                    <table class="table " style="width: 100%; table-layout: fixed; color:white" v-if="historicalData!==undefined && historicalData!==null">
                        <thead>
                            <tr>
                                <th> Date</th>
                                <th> File</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="text-align: center">{{ historicalData.executed_at.split('T')[0] || "NA" }}</td>
                                <td style="text-align: left; word-wrap:break-word;" class="file-dwnld" @click="downloadWithAxios()"><i
                                        class="fa-solid fa-arrow-down"></i>
                                    {{ historicalData.log_file_name }} </td>
                            </tr>
                        </tbody>
                    </table>
                    </p>
                </TabPanel>
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-bars" style="color:white;font-size: 20px;"></i>
                        </div>
                    </template>
                    <p class="m-0">
                        <table class="table" style="width: 100%; table-layout: fixed;" v-if="historicalData!==undefined && historicalData!==null">
                            <tbody>
                            <tr>
                                <td>Environment</td>
                                <td style="word-wrap: break-word;">{{ historicalData.environment_details || "NA" }}</td>
                            </tr>
                            <tr>
                                <td>Test suit name</td>
                                <td style="word-wrap: break-word;">{{ historicalData.test_suite_name || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>Executed at</td>
                                <td style="word-wrap: break-word;">{{ historicalData.executed_at || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>Started at</td>
                                <td style="word-wrap: break-word;">{{ historicalData.start_at || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>End at</td>
                                <td style="word-wrap: break-word;">{{ historicalData.end_at || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>Time taken</td>
                                <td style="word-wrap: break-word;">{{ historicalData.time_taken || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>Pause on Fail</td>
                                <td style="word-wrap: break-word;">{{ historicalData.pause_on_fail || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>Abort on Fail</td>
                                <td style="word-wrap: break-word;">{{ historicalData.abort_on_fail || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>Single step</td>
                                <td style="word-wrap: break-word;">{{ historicalData.single_step || "NA"}}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td style="word-wrap: break-word;">{{ historicalData.result || "NA"}}</td>
                            </tr>
                        </tbody>
                    </table>
                    </p>
                    
                </TabPanel>
            </TabView>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            metaData: {},
            historicalData: null,
            showMetaData:false
        }
    },
    props: {
        // eslint-disable-next-line vue/require-prop-type-constructor
        showActionPaneEnabled: true,
        testSuiteUUID:{
            type:String,
            default:''
        }
    },
    mounted() {
        //console.log(this.historicalData, "historicaldata");
    },
    watch:{
        testSuiteUUID(newValue){
         if(newValue!==null&&newValue!==undefined&&newValue!==''){
            this.getMetaData();
            this.getHistoricalData();
            this.showMetaData=true;
         }
        }

    },
    methods: {
       async getMetaData() {
            let url = 'http://34.30.27.29:8000/metadata/?Content-Type=application/json&bucket_uuid='+this.testSuiteUUID;
          await  axios.get(url)
                .then(res => {
                    //console.log('Res:: ', res, typeof res);
                    this.metaData = res.data[0];
                })
                .catch(error => {
                    console.log("Error in Fetching the right Pane:: ", error);
                })
        },
     async getHistoricalData() {
        //console.log(this.testSuiteUUID);
           // let url = 'http://34.30.27.29:8000/test-execution/?Content-Type=application/json&userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&test_suite_uuid='+this.testSuiteUUID;
           let url = 'http://34.30.27.29:8001/api/test_exec_data/?userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&test_suite_uuid=ae25c605-f9e0-4ac3-bdb3-ebb43b';
           await axios.get(url)
                .then(res => {
                    //console.log('Res:: ', res.data, typeof res);
                    this.historicalData = res.data;
                    console.log(this.historicalData);
                })
                .catch(error => {
                    console.log("Error in Fetching the right Pane:: ", error);
                })
        },
        fileDownload(response, title) {
            //console.log("Title: ",title)
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', title)
            document.body.appendChild(link)
            link.click()
        },
        downloadWithAxios() {
            console.log(this.historicalData.logs_path);
            //let url = "http://34.30.27.29:8001/api/test_exec_data/?userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&test_suite_uuid="+this.testSuiteUUID;
            let url =this.historicalData.logs_path;
            axios({
                method: 'get',
                url,
                
            })
                .then((response)=>{
                    this.fileDownload(response,this.historicalData.log_file_name);
                })
                .catch(() => console.log('error occured'))
        }
    },
}
</script>

<style scoped>
.file-dwnld {
    cursor: pointer;
}
:deep(.p-tabview-panels){
    top: 89px;
    position: absolute;
    height: 49%;
    overflow: hidden;
    overflow-y: auto;
}

.rightpaneview {
    width: 19%;
    top: 103px;
    height: 100%;
    font-size: 12px;
    color: #b5b5c3;
    position: absolute;
    background: #1a304d;
    border: 0px solid black;
    margin-left: 81%;
}

.table td,
.table tr,
.table thead th {
    padding: 4px;
    color: white;
    border: none;
    /* border: 1px inset rgb(160, 142, 230); */
}

.table tr{
    border-bottom: 1px solid white;
}

.table{
    color: #000;
    overflow: scroll;
    height :10%;
}

.rightpane-header {
    position: absolute;
    height: 22.06%;
    top: 0%;
    bottom: 77.94%;
    left: 0px;
    width: 100%;
    color: #8b99ab;
}

.tabview {
    margin-top: 25px;
}

table {
    color: white;
}

.rightpane {
    position: absolute;
    top: 6px;
    left: 14px;
    display: inline-block;
    width: 90px;
}
</style>