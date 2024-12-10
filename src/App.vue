<template>
  <div id="app">
     <router-view></router-view>
  </div>
</template>

<script>
// import Menu from './components/Menu.vue'
// import Webshell from './components/Webshell.vue';
// import LoadSuite from './components/LoadSuite.vue';


export default {
  name: 'App',
  components: {
  
    // Menu
    // LoadSuite,
    // Webshell
  },
  data(){
    return {
      currentComponent: '',
      isHidden: false,
      loadSuiteData:[]
    }
  },
  methods: {

    goToSignUp() {

      this.currentComponent = 'signup';
      // this.$router.push("/signup");
    },
    goToSignin() {

      this.currentComponent = 'signin';
    },
    beforeMount() {
      this.getUnits()
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  font-weight: 400;
  color: #fff;
  background-color: #1967b3;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.btn-cls{
  margin-left: 37%;
}
</style>
 