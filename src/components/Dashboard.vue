<template>
    <div class="dashboard">
      <header>
        <div class="header-item" @mouseover="showHoverItem('file')" @mouseleave="hideHoverItem()">
          File
          <div v-show="hoverItem === 'file'" class="hover-menu">
            <!-- Dropdown content for File -->
            <!-- You can add menu items or functionality here -->
          </div>
        </div>
        <div class="header-item" @mouseover="showHoverItem('loadApp')" @mouseleave="hideHoverItem()">
          Load App
          <div v-show="hoverItem === 'loadApp'" class="hover-menu">
            <!-- Dropdown content for Load App -->
            <!-- You can add menu items or functionality here -->
          </div>
        </div>
        <div class="header-item" @mouseover="showHoverItem('help')" @mouseleave="hideHoverItem()">
          Help
          <div v-show="hoverItem === 'help'" class="hover-menu">
            <!-- Dropdown content for Help -->
            <!-- You can add menu items or functionality here -->
          </div>
        </div>
      </header>
      <!-- Rest of the dashboard content -->
    </div>
  </template>
  
  <script>
  export default {
    name:  'PixiDashboard',
    data() {
      return {
        hoverItem: null
      };
    },
    methods: {
      showHoverItem(item) {
        this.hoverItem = item;
      },
      hideHoverItem() {
        this.hoverItem = null;
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
  .header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #333;
    color: #fff;
  }
  .header-item {
    position: relative;
    cursor: pointer;
  }
  .hover-menu {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ccc;
  }
  .header-item:hover .hover-menu {
    display: block;
  }
  </style>
  