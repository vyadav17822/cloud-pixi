<template>
  <div id="app">
      <div class="container">  
        <form @submit.prevent="submitForm()" id="loginForm" action="#">
          <div class="form-group">
              <label style="margin-left: 10px;">Username</label>
              <input type="text" name="username" id="username"  placeholder="Username" style="margin-left: 10px;" v-model.trim="username">
          </div>
          <div class="form-group">
            <label style="margin-left: 10px;">Password</label>
            <input type="password" id="password" placeholder="Password" style="margin-left: 10px;" v-model.trim="password"> 
          </div>
          <!-- <div class="row button" style="margin-left: 10px;"> -->
            <button type="submit"> Sign In</button>
            <!-- <button type="submit" class="signin-btn"> Sign In</button> -->
          <!-- </div> -->
        </form>
        <div class="pass" style="margin-left: 10px;"><a style="text-decoration: none;" href="#">Forgot password?</a></div>
        <div class="signup-link" style="margin-left: 10px;">Not a member? <a style="text-decoration: none;" href="/signup">Signup now</a></div>
        
      </div>
    </div>
</template>

<script>
  // import { email } from "vuelidate/lib/validators";
import { required, minLength, maxLength} from "vuelidate/lib/validators";
import axios from 'axios';
  export default {
    data() {
      return {
        username: "",
        password: ""
      };
    },
    validations: {
      username: {
        required
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(15)
    },
    },
    methods: {
      submitForm: async function(){
        console.log("Username: ", this.username, " Password: ", this.password);
        const userLoginRequest = {
          username: this.username,
          password: this.password,
        };
        try {
          let url = 'http://localhost:3003/login'
          const response = await axios.post(url, { ...userLoginRequest });
          console.log("Log response::::--- ", response);
        if (response?.data?.success) { 
          console.log("Inside the login success");
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: response.data.username
            })
          );
          localStorage.setItem("jwt", response.headers.authtoken);

          if (localStorage.getItem("jwt") != null) {
            this.$emit("loggedIn", true);
            this.$router.push({ name: "dashboard" });
          }
        } else {
          console.log("Error :::  00000");
        }
        } catch (error) {
          console.log("Error in catch:: ",error);
        }
      }

    },
}
</script>

<style scoped>
  button,
  input {
    display: block;
    margin-bottom: 10px;
    
  }
  
  .container {
    width: 500px;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 500;
    border: 2px;
    background-color: lightgrey;
  }

  #alert {
    color: red;
    margin-bottom: 10px;
  }
  .title {
    color: rgb(243,126,49);
    left: 50%;
    position: absolute;
  }

  .signin-btn{
    background: transparent;
    border: 2px solid #213;
    border-radius: 9px;
    color: #090000;
    margin-left: 2px;
  }
</style>