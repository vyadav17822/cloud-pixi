<template>
  <div class="header">
      <div class="background" />
      <div class="right-menu">
        <img class="settings-icon" alt="" src="/images/settings.svg" />
        <img class="notifications-icon" alt="" src="/images/notifications.svg" />
        <img class="search-icon" alt="" src="/images/search.svg" />
        <div class="user-name">Ved Prakash</div>
        <img class="users-img-icon" alt="" src="/images/users-img@2x.png" />
      </div>
      <div class="top-menu">
        <div class="file">
          <div class="highlighted" />
          <div class="file1">File</div>
          <img class="path-944-icon" alt="" src="/images/path-944.svg" />
        </div>
        <div class="loadapp">
          <div class="load-app">Load App</div>
          <img class="path-945-icon" alt="" src="/images/path-945.svg" />
        </div>
        <div class="apps">
          <div class="help">Help</div>
          <img class="chevron-down-icon" alt="" src="/images/chevron-down@2x.png" />
        </div>
      </div>
      <img class="logo-icon" alt="" src="/images/logo@2x.png" />
    </div>
</template>
  
  <script>
  export default {
    name: 'DashboardHeader',
    data() {
      return {
        notificationsOpen: false,
        showSidebar: false
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
    position: absolute;
    width: calc(100% + 1px);
    top: 0px;
    right: -1px;
    left: 0px;
    height: 65px;
    font-size: 13px;
    color: #6c7293;
  }

  .background {
    position: absolute;
    width: 100%;
    top: 0px;
    right: 0px;
    left: 0px;
    background-color: #1b1b28;
    height: 65px;
  }
  
  .right-menu {
    position: absolute;
    top: 19px;
    right: 30.93px;
    width: 316.7px;
    height: 34px;
  }

  .settings-icon {
    position: absolute;
    top: 7px;
    right: 185.79px;
    width: 19px;
    height: 19px;
  }

  .notifications-icon {
    position: absolute;
    height: 55.88%;
    width: 5.24%;
    top: 20.59%;
    right: 76.72%;
    bottom: 23.53%;
    left: 18.04%;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
  }
  .search-icon {
    position: absolute;
    height: 55.88%;
    width: 6%;
    top: 20.59%;
    right: 94%;
    bottom: 23.53%;
    left: 0%;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
  }
  .user-name {
    position: absolute;
    top: 7px;
    right: 38.07px;
    font-weight: 500;
    display: inline-block;
    width: 116px;
  }
  .users-img-icon {
    position: absolute;
    top: 0px;
    right: 0.02px;
    border-radius: 50%;
    width: 34px;
    height: 34px;
    object-fit: cover;
  }
  .top-menu {
    position: absolute;
    top: 0px;
    left: 251px;
    width: 308px;
    height: 65px;
    font-size: 12px;
    color: #fff;
  }
  .file {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 110px;
    height: 65px;
  }

  .highlighted {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: #272534;
    width: 110px;
    height: 65px;
  }
  .file1 {
    position: absolute;
    top: 23px;
    left: 34.35px;
    display: inline-block;
    width: 21.6px;
  }
  .path-944-icon {
    position: absolute;
    top: 29px;
    left: 67.04px;
    width: 8.6px;
    height: 5px;
    object-fit: contain;
  }
  .loadapp {
    position: absolute;
    top: 23px;
    left: 126px;
    width: 78px;
    height: 18px;
  }
  .load-app {
    position: absolute;
    top: 0px;
    left: 0px;
    display: inline-block;
    width: 68.9px;
  }
  .path-945-icon {
    position: absolute;
    top: 6px;
    left: 69.3px;
    width: 8.7px;
    height: 5px;
    object-fit: contain;
  }
  .apps {
    position: absolute;
    top: 23px;
    left: 251px;
    width: 57px;
    height: 18px;
  }
  .help {
    position: absolute;
    top: 0px;
    left: 0px;
    display: inline-block;
    width: 31px;
  }
  .chevron-down-icon {
    position: absolute;
    top: 4px;
    left: 47px;
    width: 10px;
    height: 10px;
    object-fit: cover;
  }
  .logo-icon {
    position: absolute;
    top: 7px;
    left: 25px;
    width: 200px;
    height: 51.6px;
    object-fit: cover;
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
  