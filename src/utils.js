import axios from "axios";
import { uuid } from 'vue-uuid'; 
export async function runSuiteCommand(command){
    function parseCommand(command, type) {       
        let paramsString = null;
        if(type === 'connect')
          paramsString = command.slice(17, -1);
        else if(type === 'disconnect')
          paramsString = command.slice(20, -1);
        else if(type === 'sendRcv')
          paramsString = command.slice(15, -1);
        else if(type === 'retDataToTables')
          paramsString = command.slice(23, -1);
        else if(type === 'comparePairs')
          paramsString = command.slice(13, -1);

        
        function splitParams(paramsString) {
          const result = [];
          let currentParam = '';
          let insideQuotes = false;

          for (let i = 0; i < paramsString.length; i++) {
              const char = paramsString[i];
              if (char === "'" && (i === 0 || paramsString[i - 1] !== "\\")) {
                  insideQuotes = !insideQuotes;
              } else if (char === ',' && !insideQuotes) {
                  result.push(currentParam.trim());
                  currentParam = '';
              } else {
                  currentParam += char;
              }
          }
        
          if (currentParam) {
              result.push(currentParam.trim());
          }
        
          return result;
        }  
        const args = splitParams(paramsString);
        return args;
       }

     function parseCompairPair(command){
      let parsedString = command.slice(13, -1);
      let segments = [];
      let currentSegment = '';
     
      // Variable to track if inside quotes
      let insideQuotes = false;
      for (let i = 0; i < parsedString.length; i++) {
        let char = parsedString[i];
        if (char === ',' && !insideQuotes) {
            segments.push(currentSegment.trim());
            currentSegment = '';
        } else if (char === '"' || char === `'`) {
            insideQuotes = !insideQuotes;
            currentSegment += char;
        } else {
            currentSegment += char;
        }
      }
      // Push the last segment
      segments.push(currentSegment.trim());
      return segments;
     }

     try {
      if(command.startsWith("g40cli")){
        if(command.includes('disconnectNE')){
          let data = parseCommand(command, "disconnect");
        const rb = {
         "username": data[2],
         "hostname": data[1],
         "password": data[3],
         "port": parseInt(data[4].split("=")[1], 10),
         "handle": data[0],
         "interface": "CLI",
         "step": data[5].split("=")[1] === "True",
         "disconnect_ne_uuid": uuid.v4(),
         "disconnect_status": "P"
        };
      
          let res = await axios.post('http://35.192.211.225:8001/api/disconnectNE/', {...rb})
          
          return res;
        } else if(command.includes('connectNE')){
          let data = parseCommand(command, "connect");
          const rb = {
           "username": data[2],
           "hostname": data[1],
           "password": data[3],
           "port": parseInt(data[4].split("=")[1], 10),
           "handle": data[0],
           "interface": "CLI",
           "step": "True",
           "connect_ne_uuid": uuid.v4(),
           "connection_status": "P"
          };
        
          
          let res = await axios.post('http://35.192.211.225:8001/api/connectNE/', {...rb})
          return res;
        } else if(command.includes('sendRcv') && command.startsWith("g40cli")) {
          let data = parseCommand(command, "sendRcv");
          let requestBody = {
            "command": data[1],
            "timeout": "20",
            "confirmI": false,
            "step": false,
            "match": null,
            "poll": false,
            "stash": null,
            "mode": "ssh",
            "sendOnly": false,
            "rcvOnly": false,
            "handle": data[0]
          };
          let res = await axios.post('http://35.192.211.225:8001/api/sendrcv/?Content-Type=application/json', {...requestBody})
          return res;
        }
     } else if(!command.startsWith("g40cli") && command.includes("g40cli") && command.includes("=") && command.includes('sendRcv(')){
      let splitArray = command.split("=");
      let variable_name = splitArray[0].trim();
      let sendRcvCommand = splitArray[1].trim();
      //console.log("Variable name::: ", variable_name, sendRcvCommand);
      let data = parseCommand(sendRcvCommand, "sendRcv");
      let requestBody = {
        "command": data[1],
        "timeout": "20",
        "confirmI": false,
        "step": false,
        "match": null,
        "poll": false,
        "stash": null,
        "mode": "ssh",
        "sendOnly": false,
        "rcvOnly": false,
        "handle": data[0]
      };
      let res = await axios.post('http://35.192.211.225:8001/api/sendrcv/?Content-Type=application/json', {...requestBody})
      //console.log("Response of sendrcv in CP: ", res);
      localStorage.setItem(variable_name, res.data);
      return res;
     } else if(command.includes("g40cli") && command.includes("=") && command.includes('retDataToTables(')){
        let arr = command.split("=");
        //xconState1 = g40cli.retDataToTables(showXcon1)
        let retData = parseCommand(arr[1].trim(), "retDataToTables");
        //console.log("Ret data [parsed]:: ", retData);
        let getLSData = localStorage.getItem(retData); 
        //console.log("Fetched Localhost Data:::", getLSData, typeof getLSData);
        let requestBody = {
          "sendRcvData": '' + getLSData
        };
        //console.log("Request Body[sendRcv]: ", requestBody);
        let res = await axios.post('http://35.192.211.225:8001/api/retDataToTab/?Content-Type=application/json', {...requestBody})
        localStorage.setItem(arr[0].trim(), JSON.stringify(res.data)); 
        return res;
     } else if(command.startsWith("comparePairs")){
        let parsedArray = parseCompairPair(command);
        //console.log("Parsed Array::: ", parsedArray);
        let matches = parsedArray[1].match(/^([^[]+)\['([^']+)'\](?:\['([^']+)'\])?$/);
        if (!matches) {
          //console.log("Invalid input string format");
          throw new Error('Invalid input string format');
        }
        let [, variable, key1, key2] = matches;
        let resultArray = [variable, key1];
        if (key2) {
          resultArray.push(key2);
        }
        //console.log("Result array:::: ", resultArray);
        let getFromLS = JSON.parse(localStorage.getItem(resultArray[0]));
        //console.log("Get From lS: ", getFromLS);
        if(getFromLS){
          let compare_pair_payload = {
            "stash": "notStash",
            "Compare_input": getFromLS[resultArray[1]][resultArray[2]],
            "Compare_result": parsedArray[2].slice(1,-1)
          }
          //console.log("Compare pair payload:::: ", compare_pair_payload);
          let res = await axios.post("http://35.192.211.225:8001/api/compare_pair/?Content-Type=application/json", {... compare_pair_payload})
          return res;
        }
     } else {
       //console.log("Nothing found");
     }
     } catch (error) {
        return error;
     }
}
