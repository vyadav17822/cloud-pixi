<template>
    <div>
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
  cols: 90,
  rows: 24,
  screenKeys: true,
  convertEol: true
});

terminal.loadAddon(new WebLinksAddon());
  
  export default {
    name: 'DashboardContent',
    mounted() {
      this.initializeTerminal();
      this.enablePaste();
      this.reNew();
    },
    methods: {
      reNew() {
        // const terminal = new Terminal();
        setInterval(() =>{
          axios.get("http://localhost:8000/api/logs/?Content-Type=application/json").then(
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
              // terminal.write(text);
              terminal.paste(text);
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
      executeCommand(command, terminal) {
        function parseCommand(command, type) {
 
          let paramsString = null;
          if(type === 'connect')
            paramsString = command.slice(17, -1);
          else if(type === 'disconnect')
            paramsString = command.slice(20, -1);
          else if(type === 'sendRcv')
          paramsString = command.slice(15, -1);

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
        terminal.write('\r\n$ ');
        if(command.startsWith("g40cli")){
            if(command.includes('disconnectNE')){
              // command = "g40cli.disconnectNE('near_end_cli','34.100.227.168','temproot','infinera',port=2222,step=True)";
              let data = parseCommand(command, "disconnect");
              terminal.write(`disconnecting to ${data[0]}\r \n`);
              console.log("Data after parse:: ", data);
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

              axios.post('http://127.0.0.1:8000/api/disconnectNE/', {...rb})
              .then(res => {
                console.log("Response of ConnectNE:: ", res);
                terminal.write(res.data["message"]);
                terminal.write('\r \n');
              })
              .catch(error => {
                  terminal.write(`Error executing command: ${error.message}`)
              })
            } else if(command.includes('connectNE')){
              console.log("Inside the connect NE: ");
              command = "g40cli.connectNE('near_end_cli','34.100.227.168','temproot','infinera',port=2222,step=True)";
              let data = parseCommand(command, "connect");
              console.log("Data after parse:: ", data);
              terminal.write(`connecting to ${data[0]} \r \n`);
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
              axios.post('http://127.0.0.1:8000/api/connectNE/', {...rb})
              .then(res => {
                console.log("Response of ConnectNE:: ", res);
                terminal.write(res.data["\n"]);
                terminal.write('\n');
                terminal.write(res.data["show software-load"]);
                terminal.write('\n');
                terminal.write(res.data["show inventory"]);
                terminal.write('\n');
                terminal.write(res.data["show controller-card redundancy-status"]);
                terminal.write('\r \n');

                terminal.write('------------------ \r \n');
                terminal.write('Step:       g40cli.connect near_end_cli \r \n');
                terminal.write('Result:     Passed \r \n');
                terminal.write('Details:    prompt confirmed \r \n');
                terminal.write('------------------ \r \n');


              })
              .catch(error => {
                  terminal.write(` ${error} \r \n`)
                terminal.write('------------------ \r \n');
                terminal.write('Step:       g40cli.connect near_end_cli \r \n');
                terminal.write('Result:     failed \r \n');
                terminal.write('Details:    prompt confirmed \r \n');
                terminal.write('------------------ \r \n');
              })
            } else if(command.includes('sendRcv')) {
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
              console.log("Request Body[sendrcv]::: ", requestBody);
              ///api/sendrcv/?Content-Type=application/json
              axios.post('http://localhost:8000/api/sendrcv/?Content-Type=application/json', {...requestBody})
              .then(res => {
                terminal.write(res.data);
                terminal.write('\r \n');
              })
              .catch(error => {
                  terminal.write(`Error executing command: ${error}`)
              })
            }
        } else {
          if(command !== '$'){
            axios.post('http://localhost:3000/execute', {command})
            .then(res => {
                terminal.write(res.data);
            })
            .catch(error => {
                terminal.write(`Error executing command: ${error.message}`)
            })
            .finally(() =>{
                terminal.write('\r\n$ ');
            })
          } else {
            // terminal.write()
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
  </style>
  