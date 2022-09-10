<template>
  <el-container>
    <router-link :to="`/login/LoginEmail?email=${email}`">
      <i style="color: white" class="el-icon-back">{{ email }}</i>
    </router-link>
    <div style="color: white; height: 25px"></div>
    <el-header style="color: white; height: 40px;padding: 0" class="bigFont">输入代码</el-header>
    <div style="color: white; height: 10%">请点击验证码，将代码发送至</div>
    <div style="color: white; height: 10%"><b>{{ email }}</b>。</div>
    <div style="color: white; height: 10%">请输入代码进行登录。</div>

    <div style="color: red; height: 15%;line-height: 20px" v-show="!isMatch">
      请输入 6 位代码。该代码仅包含数字。
    </div>
    <div style="color: red; height: 35px;line-height: 20px" v-show="isNotCorrect">
      该代码无效。检查该代码并重试。
    </div>
    <div style="color: red; height: 35px;line-height: 20px" v-show="isNotRegister">
      该邮箱未注册！
    </div>
    <div style="color: red; height: 35px;line-height: 20px" v-show="isExpiredOrBad">
      该代码错误或已经过期！
    </div>

    <input
        autofocus
        v-focus
        maxlength="6"
        @input="judge"
        v-model="inputVerificationCode"
        id="input1"
        type="text"
        :style="inputClass"
        @keyup.enter="toLog"
        placeholder="输入代码"/>
    <div style="height: 20px"></div>
    <button id="input3" :type="type" :disabled="disabled" @click="getVerificationCode">{{ time }}</button>
    <div class="smallFont">
      <router-link style="color: #0051ff" :to="`/login/LoginEmail?email=${email}`">改为使用你的密码</router-link>
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
  name: "LoginVerification",
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
      type: "primary",
      disabled: false,
      time: "验证码",
      count: 60,
      email: this.$route.query.email,
      // flag 用于判断页面是从前一个页面跳转而来，还是在当前页面刷新，防止刷新页面导致重复发送验证码
      empId: '',
      password: '',
      inputVerificationCode: '',
      inputClass: {
        'border-bottom': '1px solid darkblue',
        'border-top': '0px',
        'border-left': '0px',
        'border-right': '0px',
        'height': '30px',
        'width': '290px',
        'outline': 'none',
      },
      isMatch: true,
      isNotCorrect: false,
      isFirst: true,
      isNotRegister: false,
      userToken: '',
      isExpiredOrBad: false,
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    doLoop(seconds) {
      let countdown = setInterval(() => {
        if (seconds > 0) {
          this.time = seconds;
          --seconds;
        } else {
          this.time = "验证码";
          this.disabled = false;
          this.type = "primary";
          clearInterval(countdown);
        }
      }, 1000);
    },
    getVerificationCode() {
      this.sendTextMail();
      this.disabled = true;
      this.time = "请稍候";
      this.type = "gray";
      setTimeout(() => {
        this.doLoop(60);
      }, 1000);
    },
    judge(e) {
      if (!this.isFirst) {
        this.isExpiredOrBad = false;
        if (!this.isNotCorrect) {
          let myInput = e.target.value;
          if (myInput === '') {
            this.isMatch = false;
          } else if (myInput.length < 6) {
            this.isMatch = false;
          } else {
            this.isMatch = true;
          }
        }
      }
    },
    sendTextMail() {
      axios.get(`http://localhost:8888/sendMail/sendTextMail?to=${this.email}`)
          .then(response => {
            if (response.data.code !== 200) {
              alert("发送邮件失败");
            }
          })
          .catch(error => {
            console.log(error.message);
          })
    },
    toLog() {
      this.isFirst = false;
      this.isMatch = true;
      this.isNotCorrect = false;
      this.isExpiredOrBad = false;
      if (this.inputVerificationCode === '') {
        this.isMatch = false;
      } else if (this.inputVerificationCode.length < 6) {
        this.isMatch = false;
      } else {
        //进行验证码与邮箱的验证
        axios.post(`http://localhost:8888/verify/verifyVerificationCode?email=${this.email}&verificationCode=${this.inputVerificationCode}`)
            .then(response => {
              if (response.data.code === 200) {
                axios.get(`http://localhost:8888/sendMail/LoginByVerificationCode?email=${this.email}&verificationCode=${this.verificationCode}`)
                    .then(response => {
                      if (response.data.code === 200) {
                        let info = response.data.data.info;
                        this.email = info.email;
                        this.empId = info.empId;
                        this.password = info.password;
                        let token = response.data.data.token;
                        this.userToken = token;
                        localStorage.setItem("email", this.email);
                        localStorage.setItem("empId", this.empId)
                        localStorage.setItem("password", this.password);
                        this.changeLogin({Authorization: this.userToken});

                        axios.get(`http://localhost:8888/permission/getPriorityByEmail?email=${this.email}`)
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
                            name: 'WorkLogFrame',
                            params: {
                              empId: this.empId,
                              email: this.email,
                              password: this.password
                            }
                          })
                        }, 1000)

                      } else {
                        // 该邮箱未注册！
                        this.isNotRegister = true;
                      }
                    })
                    .catch(error => {
                      console.log(error.message);
                      localStorage.removeItem("Authorization");
                      this.$router.push('/login/LoginVerification');
                    })
              } else {
                this.isExpiredOrBad = true;
                console.log(response.data.message);
              }
            })
            .catch(error => {
              console.log(error.message);
            })
      }
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

#input3 {
  /*border: none;*/
  width: 60px;
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
</style>