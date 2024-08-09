<template>
    <div v-if="!showActionPaneEnabled" class="rightpaneview">
        <div class="rightpane-header">
            <div class="rightpane" style="font-size: 16px; font-weight: bold; color: white">Properties</div>
        </div>
        <div class="tabview">
            <TabView class="tabview-custom">
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="fa-solid fa-user" style="color:white;font-size: 20px;"></i>
                        </div>
                    </template>
                    <p class="m-0">
                    <table class="table table-bordered" style="width: 100%; table-layout: fixed;">
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
                    <table class="table table-bordered" style="width: 100%; table-layout: fixed;">
                        <thead>
                            <tr>
                                <th> Date</th>
                                <th> File</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(suite, row) in historicalData" :key="row">
                                <td style="text-align: center">{{ suite.executed_at.split('T')[0] }}</td>
                                <td style="text-align: left; word-wrap:break-word;" class="file-dwnld" @click="downloadWithAxios(suite)"><i
                                        class="fa-solid fa-arrow-down"></i>
                                    {{ suite.logs_path.substring(suite.logs_path.lastIndexOf('/') + 1) }} </td>
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
                        <table class="table table-bordered" style="width: 100%; table-layout: fixed;">
                        <tbody>
                            <tr>
                                <td>Environment</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].environment_details }}</td>
                            </tr>
                            <tr>
                                <td>Test suit name</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].test_suite_name }}</td>
                            </tr>
                            <tr>
                                <td>Executed at</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].executed_at }}</td>
                            </tr>
                            <tr>
                                <td>Started at</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].start_at }}</td>
                            </tr>
                            <tr>
                                <td>End at</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].end_at }}</td>
                            </tr>
                            <tr>
                                <td>Time taken</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].time_taken }}</td>
                            </tr>
                            <tr>
                                <td>Pause on Fail</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].pause_on_fail }}</td>
                            </tr>
                            <tr>
                                <td>Abort on Fail</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].abort_on_fail }}</td>
                            </tr>
                            <tr>
                                <td>Single step</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].single_step }}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td style="word-wrap: break-word;">{{ historicalData[0].result }}</td>
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
            historicalData: []
        }
    },
    props: {
        // eslint-disable-next-line vue/require-prop-type-constructor
        showActionPaneEnabled: true,
    },
    mounted() {
        this.getMetaData();
        this.getHistoricalData();
    },
    methods: {
        getMetaData() {
            let url = 'http://35.192.211.225:8000/metadata/?Content-Type=application/json&bucket_uuid=ae25c605-f9e0-4ac3-bdb3-ebb43b';
            axios.get(url)
                .then(res => {
                    console.log('Res:: ', res, typeof res);
                    this.metaData = res.data[0];
                    console.log("Meta Data::: ", this.metaData);
                    
                })
                .catch(error => {
                    console.log("Error in Fetching the right Pane:: ", error);
                })
        },
        getHistoricalData() {
            let url = 'http://35.192.211.225:8000/test-execution/?Content-Type=application/json&userid_uuid=e5ed4652-96ea-49ba-b3bb-f84fd7&test_suite_uuid=12345678-1234-5678-1234-567812345684';
            axios.get(url)
                .then(res => {
                    console.log('Res:: ', res.data, typeof res);
                    this.historicalData = res.data;
                })
                .catch(error => {
                    console.log("Error in Fetching the right Pane:: ", error);
                })
        },
        fileDownload(response, title) {
            console.log("Title: ",title)
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', title)
            document.body.appendChild(link)
            link.click()
        },
        downloadWithAxios(val) {
            let url = val.logs_path;
            axios({
                method: 'get',
                url,
                responseType: 'arraybuffer',
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            })
                .then((response) => {
                    this.fileDownload(response, val.logs_path.substring(val.logs_path.lastIndexOf('/') + 1))
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

.rightpaneview {
    width: 16%;
    top: 103px;
    height: 100%;
    font-size: 12px;
    color: #b5b5c3;
    position: absolute;
    background: #1a304d;
    border: 0px solid black;
    margin-left: 84%;
}

.table td,
th {
    padding: 4px;
    /* border: 1px inset rgb(160, 142, 230); */
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