<template>
  <div id="app">
    <Header />
    <div class="btn-cls" v-if="isHidden">
    <!-- <router-link to="/LoadSuite"><button class="btn"> Load Suite</button></router-link>
    <router-link to="/shell"><button class="btn"> Shells</button></router-link> -->
    <!-- <router-link to="/signin"><button class="btn"> Signin</button></router-link> -->
    <!-- <router-link to="/shell"><button class="btn"> Shells</button></router-link> -->
    <!-- <button class='btn' @click="showTerminal()"> Shell</button> -->
    <!-- <button class='btn' @click="goToSignUp()">Signup</button>
    <button class='btn' @click="goToSignin()">Signin</button> -->
    </div>
    <router-view></router-view>
    <!-- <div v-if="currentComponent === 'loadsuite'">
      <LoadSuite/>
    </div>
    <div v-else-if="currentComponent === 'terminal'">
      <Webshell />
    </div> -->
  </div>
</template>

<script>

import Header from './components/Header.vue';
// import Webshell from './components/Webshell.vue';
// import LoadSuite from './components/LoadSuite.vue';


export default {
  name: 'App',
  components: {
    Header,
    // LoadSuite,
    // Webshell
  },
  data(){
    return {
      currentComponent: '',
      isHidden: false
    }
  },
  methods: {
    showLoadSuite() {
      this.currentComponent = 'loadsuite'
      console.log(this.currentComponent);
    },
    showTerminal() {
      this.currentComponent = 'terminal'
      console.log(this.currentComponent);
    },
    goToSignUp() {
      console.log("hello sign up");
      this.currentComponent = 'signup';
      // this.$router.push("/signup");
    },
    goToSignin() {
      console.log("Hello Sign Up");
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
