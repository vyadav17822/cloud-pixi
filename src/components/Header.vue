<template>
    <div>
      <div class="header">
        <button class="toggle-sidebar" @click="toggleSidebar"><i class="fas fa-bars"></i></button>
        <div class="logo"><img
          src= "../../assets/img/infn-logo.png"          
          height="45px"
          alt=""
          width="160px"
          loading="lazy"
          style ="margin-left:110px;"
        /></div>
        <div class="search-container">
          <div class="search">
            <input type="text" v-model="search"/></div>
        </div>
        <div class="user-profile">
          <div class="user-info">
            <Avatar label="U" class="mr-2" style="background-color: #dee9fc; color: #1a2551" shape="circle" />
            <button @click="toggleNotifications"><i class="fas fa-bell"></i></button>
            <button @click="openSettings"><i class="fas fa-cog"></i></button>
          </div>
        </div>
      </div>
      <div class="sidebar" v-if="showSidebar">
        <!-- Sidebar content here -->
        <!-- Example options -->
        <ul>
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardHeader',
    data() {
      return {
        username: "vyadav",
        notificationsOpen: false,
        showSidebar: false,
      };
    },
    methods: {
      toggleNotifications() {
        this.notificationsOpen = !this.notificationsOpen;
        // logic to toggle notifications
      },
      openSettings() {
        // logic to open settings
      },
      toggleSidebar() {
        this.showSidebar = !this.showSidebar;
      },
    },
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    align-items: center;
    background-color: rgb(243,126,49); /* Grey color */
    padding: 5px 20px;
  }
  
  .toggle-sidebar {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .logo {
    font-size: 24px;
  }
  
  .search-container {
    flex: 1; /* This pushes the search to the right */
    display: flex;
    justify-content: flex-end;
  }
  
  .search {
    text-align: center;
  }
  
  .user-profile {
    display: flex;
    align-items: center;
  }
  
  .user-info {
    margin-right: 20px;
  }
  
  .user-info button {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .user-info button i {
    font-size: 20px;
  }
  
  .user-info span {
    margin-right: 10px;
  }
  
  .sidebar {
    width: 200px;
    background-color: #f0f0f0;
    border-right: 1px solid #ccc;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    z-index: 1000;
  }
  
  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .sidebar li {
    padding: 10px;
    cursor: pointer;
  }
  
  .sidebar li:hover {
    background-color: #ddd;
  }
  </style>
  