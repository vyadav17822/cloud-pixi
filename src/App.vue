<template>
  <div id="app">
    <Header />
    <div class="btn-cls" v-if="isHidden">
    <router-link to="/loadsuits"><button class="btn"> Load Suits</button></router-link>
    <router-link to="/shell"><button class="btn"> Shells</button></router-link>
    <router-link to="/signin"><button class="btn"> Signin</button></router-link>
    <!-- <router-link to="/shell"><button class="btn"> Shells</button></router-link> -->
    <!-- <button class='btn' @click="showTerminal()"> Shell</button> -->
    <!-- <button class='btn' @click="goToSignUp()">Signup</button>
    <button class='btn' @click="goToSignin()">Signin</button> -->
    </div>
    <router-view></router-view>
    <div v-if="currentComponent === 'loadsuits'">
      <LoadSuits />
    </div>
    <div v-else-if="currentComponent === 'terminal'">
      <Content />
    </div>
    <div v-else-if="currentComponent === 'signin'">
      <UserSignin />
    </div>
    <div v-else-if="currentComponent === 'signup'">
      <UserSignUp />
    </div>
  </div>
</template>

<script>

import Header from './components/Header.vue';
import Content from './components/Content.vue';
import LoadSuits from './components/LoadSuits.vue';
import UserSignUp from './components/UserSignUp.vue';
import UserSignin from './components/UserSignin.vue';


export default {
  name: 'App',
  components: {
    Header,
    LoadSuits,
    Content,
    UserSignUp,
    UserSignin
  },
  data(){
    return {
      currentComponent: '',
      isHidden: false
    }
  },
  methods: {
    showLoadSuits() {
      this.currentComponent = 'loadsuits'
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
