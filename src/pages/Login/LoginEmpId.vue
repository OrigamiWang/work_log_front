<template>
  <el-container>
    <router-link :to="`/login?empId=${empId}`">
      <i style="color: white" class="el-icon-back">工号{{ empId }}</i>
    </router-link>
    <div style="height: 25px"></div>
    <el-header style="color: white; height: 40px;padding: 0" class="bigFont">输入密码</el-header>
    <transition name="fade">
      <div style="color: red; height: 50px;line-height: 20px" v-show="!isMatch">
        你的工号或密码不正确。如果你不记得你的密码，请
        <router-link :to="`/login/LoginAuthentication?email=${email}`">立即进行重置。</router-link>
      </div>
    </transition>
    <div style="height: 50px">
      <input
          autofocus
          v-focus
          v-model="password"
          type="password"
          :style="inputClass"
          @keyup.enter="toLog"
          placeholder="密码"/>
    </div>
    <div class="smallFont">
      <router-link style="color: #0051ff" :to="`/login/LoginAuthentication?email=${email}`">忘记了密码？</router-link>
    </div>
    <div class="loginBtn">
      <input @click="toLog" id="input2" type="submit" :value="inputVal">
    </div>
  </el-container>


</template>

<script>
import axios from 'axios';
import {mapMutations} from "vuex";

export default {
  name: "LoginEmpId",
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  data() {
    return {
      inputVal: '登录',
      empId: this.$route.query.empId ? this.$route.query.empId : '',
      password: '',
      inputClass: {
        'border-bottom': '1px solid darkblue',
        'border-top': '0px',
        'border-left': '0px',
        'border-right': '0px',
        'height': '30px',
        'width': '350px',
        'outline': 'none',
      },
      isMatch: true,
      userToken: '',
      email: this.$route.query.email,
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    toLog() {
      this.inputClass["border-bottom"] = "1px solid darkblue";
      axios.get(`http://localhost:8888/login/loginByEmpId?empId=${this.empId}&password=${this.password}`)
          .then(response => {
            if (response.data.code === 200) {
              let info = response.data.data.USERINFO;
              let empId = info.empId;
              let email = info.email;
              let password = info.password;
              let token = response.data.data.token;
              this.userToken = token;
              window.localStorage.setItem('empId', empId);
              window.localStorage.setItem('email', email);
              window.localStorage.setItem('password', password);
              this.changeLogin({Authorization: this.userToken})

              axios.get(`http://localhost:8888/permission/getPriorityByEmpId?empId=${empId}`)
                  .then(response => {
                    this.$store.commit('saveRoles', response.data.data);
                  })
                  .catch(error => {
                    console.log(error.message);
                  })

              this.inputVal = "请稍候...";
              setTimeout(() => {
                this.$router.push({
                  name: 'WorkLogOrigami',
                  params: {
                    empId: empId,
                    email: email,
                    password: password
                  }
                })
              }, 1000)

            } else {
              this.inputClass["border-bottom"] = "1px solid red";
              this.isMatch = false;
            }
          })
          .catch(error => {
            //发生错误，清除token并返回登录界面
            localStorage.removeItem('Authorization');
            this.$router.push('/login/LoginEmpId');
            console.log(error.message)
          })
    },
  }
}
</script>

<style scoped>
#input2 {
  background-color: #0067B8;
  color: white;
  border: none;
  width: 108px;
  height: 32px;

}

#input2:hover {
  background-color: #0f578f;
}

.bigFont {
  font-size: x-large;
  font-weight: bold;
}

input::-webkit-input-placeholder {
  font-size: 16px;
}

a {
  text-decoration: none;
  color: #0067B8;
}

#input2:hover {
  cursor: pointer

}

.smallFont {
  height: 45px;
  font-size: 13px;
}

.loginBtn {
  text-align: right;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>