<template>
    <div class="rest-client">
      <h2>REST Client</h2>
      <div class="form-group">
        <label for="method">Method:</label>
        <select id="method" v-model="method">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
            <label for="url">URL:</label>
            <input type="text" id="url" v-model="url" placeholder="Enter URL">
      </div>

      <div class="form-group" v-if="method !== 'GET'">
        <label for="body">Request Body:</label>
        <textarea id="body" v-model="body" placeholder="Enter request body"></textarea>
      </div>
      <div class="form-group">
        <label for="headers">Headers:</label>
        <textarea id="headers" v-model="headers" placeholder="Enter headers"></textarea>
      </div>
      <button @click="sendRequest">Send Request</button>
      <div v-if="response" class="response">
        <h3>Response:</h3>
        <pre>{{ response }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RestClient',
    data() {
      return {
        method: 'GET',
        url: '',
        body: '',
        headers: '',
        response: null
      };
    },
    methods: {
      sendRequest() {
        const requestOptions = {
          method: this.method,
          headers: this.parseHeaders(),
          body: this.body
        };
  
        fetch(this.url, requestOptions)
          .then(response => response.json())
          .then(data => {
            this.response = JSON.stringify(data, null, 2);
          })
          .catch(error => {
            this.response = `Error: ${error.message}`;
          });
      },
      parseHeaders() {
        const headers = {};
        if (this.headers.trim() !== '') {
          const lines = this.headers.split('\n');
          lines.forEach(line => {
            const [key, value] = line.split(':');
            headers[key.trim()] = value.trim();
          });
        }
        return headers;
      }
    }
  }
  </script>
  
  <style scoped>
  .rest-client {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    font-weight: bold;
  }
  
  textarea {
    width: 100%;
    height: 100px;
  }
  
  button {
    margin-top: 10px;
  }
  
  .response {
    margin-top: 20px;
    border-top: 1px solid #ccc;
    padding-top: 20px;
  }
  </style>
  