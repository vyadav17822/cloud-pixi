<template>
    <div class="webshell-xterm">
      <!-- <h2>Shell Management</h2> -->
      <div ref="terminal"></div>
    </div>
  </template>
  
  <script>
  import { Terminal } from 'xterm';
  import axios from 'axios';
  import 'xterm/css/xterm.css';

  import { WebLinksAddon } from '@xterm/addon-web-links';

const terminal = new Terminal({
  termName: "webshell",
  cols: 120,
  rows: 24,
  screenKeys: true,
  convertEol: true
});

terminal.loadAddon(new WebLinksAddon());
  
  export default {
    name: 'WebShell',
    mounted() {
      this.initializeTerminal();
      this.enablePaste();
      // this.reNew();
    },
    methods: {
      reNew() {
        setInterval(() =>{
          axios.get("http://35.192.211.225:8001/api/logs/?Content-Type=application/json").then(
        (response) =>{
          console.log("----- response:: ",response);
          terminal.write(response.data.join());
        }).catch(error =>{
          console.log(error);
        })
        },30000)
      },
      initializeTerminal() {
        terminal.open(this.$refs.terminal);
  
        // Handle user input
        terminal.onKey(e => {
          const printable = !e.altKey && !e.ctrlKey && !e.metaKey;
          if (e.domEvent.key === 'Enter') {
            const input = terminal.buffer.active.getLine(terminal.buffer.active.baseY + terminal.buffer.active.cursorY).translateToString().trim();
            this.executeCommand(input, terminal);
          } else if(e.domEvent.key === 'Backspace'){
            terminal.write('\b \b');
          } else if(e.domEvent.key === "\x03"){
            terminal.write("hello")
          }  else if(e.domEvent.key === "\x16"){
            terminal.write("hello")
          } else if (printable) {
            terminal.write(e.key);
          } else if (terminal.hasSelection() && e.domEvent.key === "�") {
            this.execCommand('copy')
          }
        });
        terminal.write('$ '); // Display prompt initially
      },
      enablePaste() {
        terminal.attachCustomKeyEventHandler((key) => {
          if(key.ctrlKey && (key.key === 'v' || key.key === 'V')){
            navigator.clipboard.readText().then(text => {
              console.log("Inside the v: text", text);
              terminal.write(text);
              // terminal.paste(text);
            }).catch(err => {
              console.log(err);
            });
            return false;
          } else if(key.ctrlKey && (key.key === 'c'||key.key ==='C')){
            let selectedText = terminal.getSelection();
            if(selectedText){
              navigator.clipboard.writeText(selectedText);
            }
            return false;
          }
          return true;
        });
      },
      getCommand(terminal){
        const input = terminal.buffer.active.getLine(terminal.buffer.active.baseY + terminal.buffer.active.cursorY).translateToString().trim();
        console.log("Input: ", input);
        return input.startsWith('$')? input.slice(1): input;
      },
      async executeCommand(command, terminal) {
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

          console.log("Params String: ", paramsString);
          // let arr = paramsString.split(",");
          // console.log("Data in arr: ", arr);
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
          console.log("Args after split:: ", args);
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
        terminal.write('\r\n$ ');
        if(command.startsWith("g40cli")){
            if(command.includes('disconnectNE')){
              // command = "g40cli.disconnectNE('near_end_cli','34.100.227.168','temproot','infinera',port=2222,step=True)";
              let data = parseCommand(command, "disconnect");
              terminal.write(`disconnecting to ${data[0]}\r \n`);
            const rb = {
             "username": data[2],
             "hostname": data[1],
             "password": data[3],
             "port": parseInt(data[4].split("=")[1], 10),
             "handle": data[0],
             "interface": "CLI",
             "step": data[5].split("=")[1] === "True"
            };

              console.log("Request body:: ", rb);

              axios.post('http://35.192.211.225:8001/api/disconnectNE/', {...rb})
              .then(res => {
                terminal.write(res.data["message"]);
                terminal.write('\n');
                terminal.write(`${data[0]} disconnected successfully`);
              })
              .catch(error => {
                  terminal.write(`${error.message}`)
              })
            } else if(command.includes('connectNE')){
              console.log("Inside the connect NE: ");
              // command = "g40cli.connectNE('near_end_cli','34.100.227.168','temproot','infinera',port=2222,step=True)";
              let data = parseCommand(command, "connect");
              terminal.write(`connecting to ${data[0]} \r \n`);
              const rb = {
               "username": data[2],
               "hostname": data[1],
               "password": data[3],
               "port": parseInt(data[4].split("=")[1], 10),
              //  "port": 22,
               "handle": data[0],
               "interface": "CLI",
               "step": "True"
              };

              console.log("Request body:: ", rb);
              axios.post('http://35.192.211.225:8001/api/connectNE/', {...rb})
              .then(res => {
                console.log("Response of ConnectNE:: ", res);
                terminal.write(res.data["\n"]);
                terminal.write('\n');
                terminal.write(res.data["show software-load"]);
                terminal.write('\n');
                terminal.write(res.data["show inventory"]);
                terminal.write('\n');
                terminal.write(res.data["show controller-card redundancy-status"]);
                terminal.write('\n');

                terminal.write('------------------ \n');
                terminal.write(`Step:       g40cli.connect ${data[0]} \n`);
                terminal.write('Result:     Passed  \n');
                terminal.write('Details:    prompt confirmed \n');
                terminal.write('------------------ \n');


              })
              .catch(error => {
                terminal.write(` ${error} \n`)
                terminal.write('------------------ \n');
                terminal.write(`Step:       g40cli.connect ${data[0]} \n`);
                terminal.write('Result:     failed \n');
                terminal.write('Details:    prompt confirmed \n');
                terminal.write('------------------ \n');
              })
            } else if(command.includes('sendRcv') && command.startsWith("g40cli")) {
              // command = "g40cli.sendRcv('near_end_cli','add -mf degree-1 ')";
              let data = parseCommand(command, "sendRcv");
              console.log("Parsed Data::: ", data);
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
              axios.post('http://35.192.211.225:8001/api/sendrcv/?Content-Type=application/json', {...requestBody})
              .then(res => {
                terminal.write(res.data);
                return res.data;
              })
            }
        } else if(!command.startsWith("g40cli") && command.includes("g40cli") && command.includes("=") && command.includes('sendRcv(')){
          let splitArray = command.split("=");
          let variable_name = splitArray[0].trim();
          let sendRcvCommand = splitArray[1].trim();
          console.log("Variable name::: ", variable_name, sendRcvCommand);
          // let result = await this.executeCommand(sendRcvCommand, terminal);
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
          axios.post('http://35.192.211.225:8001/api/sendrcv/?Content-Type=application/json', {...requestBody})
          .then(res => {
            terminal.write(res.data);
            localStorage.setItem(variable_name, res.data);
          })
        } else if(command.includes("g40cli") && command.includes("=") && command.includes('retDataToTables(')){
          let arr = command.split("=");
          //xconState1 = g40cli.retDataToTables(showXcon1)
          let retData = parseCommand(arr[1].trim(), "retDataToTables");
          console.log("Ret data [parsed]:: ", retData);
          let getLSData = localStorage.getItem(retData); 
          console.log("Fetched Localhost Data:::", getLSData, typeof getLSData);
          let requestBody = {
            "sendRcvData": '' + getLSData
          };
          console.log("Request Body[sendRcv]: ", requestBody);
          axios.post('http://35.192.211.225:8001/api/retDataToTab/?Content-Type=application/json', {...requestBody})
          .then(res => {
            console.log("Result of retDataToTables::: ", res, typeof res);
            localStorage.setItem(arr[0].trim(), JSON.stringify(res.data)); 
            terminal.write(JSON.stringify(res.data));
            terminal.write('\n');
          })
        } else if(command.startsWith("comparePairs")){
          let parsedArray = parseCompairPair(command);
          console.log("Parsed Array::: ", parsedArray);
          // let a = parsedArray[1].split("[");
          let matches = parsedArray[1].match(/^([^[]+)\['([^']+)'\](?:\['([^']+)'\])?$/);
          if (!matches) {
            terminal.write("Invalid input string format");
          }
          let [, variable, key1, key2] = matches;
          let resultArray = [variable, key1];
          if (key2) {
            resultArray.push(key2);
          }
          console.log("Result array:::: ", resultArray);
          let getFromLS = JSON.parse(localStorage.getItem(resultArray[0]));
          console.log("Get From lS: ", getFromLS);
          if(getFromLS){
            let compare_pair_payload = {
              "stash": "notStash",
              "Compare_input": getFromLS[resultArray[1]][resultArray[2]],
              "Compare_result": parsedArray[2].slice(1,-1)
            }
            console.log("Compare pair payload:::: ", compare_pair_payload);
            axios.post("http://35.192.211.225:8001/api/compare_pair/?Content-Type=application/json", {... compare_pair_payload})
            .then(res => {
              console.log("Res:::: ", res);
              terminal.write(res.data);
              terminal.write('\n');
            })
            .catch(err => {
              terminal.write(err);
            })
          }
          
        } else {
          if(command !== '$'){
            axios.post('http://localhost:3000/execute', {command})
            .then(res => {
                terminal.write(res.data);
            })
            .catch(error => {
                console.log(error);
                // terminal.write(`Error executing command: ${error.message}`)
            })
            .finally(() =>{
                terminal.write('\r\n ');
            })
          } else {
            terminal.write("\r\n");
            console.log("Inside the else part:");
          }
        } 
      }
    }
  }
  </script>
  
  <style scoped>
  div {
    padding: 20px;
  }
  .webshell-xterm{
    margin-top: 2%;
  }
  </style>
  