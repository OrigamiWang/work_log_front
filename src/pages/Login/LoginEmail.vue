<template>
  <el-container>
    <router-link :to="`/login?empId=${email}`">
      <i style="color: white" class="el-icon-back">{{ email }}</i>
    </router-link>
    <div style="height: 25px"></div>
    <el-header style="height: 40px;padding: 0; color: white;" class="bigFont">输入密码</el-header>
    <transition name="fade">
      <div style="color: red; height: 50px;line-height: 20px" v-show="!isMatch">
        你的邮箱或密码不正确。如果你不记得你的密码，请
        <router-link :to="{path: '/login/LoginAuthentication', query: {email: this.email}}">立即进行重置。</router-link>
      </div>

    </transition>
    <div style="height: 50px">
      <input
          v-focus
          autofocus
          v-model="password"
          type="password"
          :style="inputClass"
          @keyup.enter="toLog"
          placeholder="密码"/>
    </div>
    <div class="smallFont">
      <router-link style="color: #0051ff" :to="`/login/LoginAuthentication?email=${email}`">忘记了密码？</router-link>
    </div>
    <div class="smallFont">
      <router-link style="color: #0051ff" :to="`/login/LoginVerification?email=${email}`">通过电子邮件方式将验证码发送到 {{ email }}</router-link>
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
      inputVal: "登录",
      email: this.$route.query.email,
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
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    toLog() {
      axios.get(`http://localhost:8888/login/loginByEmail?email=${this.email}&password=${this.password}`)
          .then(response => {
            if (response.data.code === 200) {
              let info = response.data.data.USERINFO;
              let empId = info.empId;
              let email = info.email;
              let password = info.password;
              let token = response.data.data.token;
              window.localStorage.setItem('empId', empId);
              window.localStorage.setItem('email', email);
              window.localStorage.setItem('password', password);
              console.log("token = ", token);
              this.userToken = token;
              this.changeLogin({Authorization: this.userToken});

              axios.get(`http://localhost:8888/permission/getPriorityByEmail?email=${email}`)
                  .then(response => {
                    this.$store.commit('saveRoles', response.data.data);
                    console.log(this.$store.state.roles);
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
            this.$router.push('/login/LoginEmail');
            console.log(error.message);
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
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

</style>