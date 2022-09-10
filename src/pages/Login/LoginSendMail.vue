<template>
  <el-container>
    <router-link :to="`/login/LoginRegisterPassword?password=${password}&email=${email}`">
      <i style="color: white" class="el-icon-back">{{ email }}</i>
    </router-link>
    <div style="height: 10%"></div>
    <el-header style="color: white; height: 15%;padding: 0" class="bigFont">验证电子邮件</el-header>
    <div style="color: white; height: 15%; font-size: 14px">点击发送验证码到 <b>{{ email }}</b> 。如果没</div>
    <div style="color: white; height: 15%; font-size: 14px">有收到电子邮件，请查看垃圾邮件文件夹或<a id="repeat"
                                                                                                    @click="sendTextMail">重试</a>。
    </div>


    <transition name="fade">
      <div style="color: red; height: 35px;line-height: 10%" v-show="!isMatch">
        请输入 6 位代码。该代码仅包含数字。
      </div>
    </transition>
    <transition name="fade">
      <div style="color: red; height: 10%;line-height: 10%" v-show="isNotCorrect">
        该代码无效。检查该代码并重试。
      </div>
    </transition>
    <transition name="fade">
      <div style="color: red; height: 35px;line-height: 20px" v-show="isExpiredOrBad">
        该代码错误或已经过期！
      </div>
    </transition>

    <input
        maxlength="6"
        v-focus
        autofocus
        @input="judge"
        v-model="inputVerificationCode"
        id="input1"
        type="text"
        :style="inputClass"
        @keyup.enter="toLog"
        placeholder="输入代码"/>

    <div style="height: 5%"></div>

    <button id="input3" :type="type" :disabled="disabled" @click="getVerificationCode">{{ time }}</button>
    <div style="color: white; font-size: x-small;height: 20%">选择“创建”即表示你同意 Origami 服务协议和隐私和 Cookie
      声明。
    </div>
    <div class="loginBtn">
      <input @click="toLog" id="input2" type="submit" value="创建">
    </div>
  </el-container>


</template>

<script>
import axios from 'axios';

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
      type: "primary",
      disabled: false,
      time: "验证码",
      count: 60,
      verificationCode: '',
      password: this.$route.query.password,
      email: this.$route.query.email,
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
      isExpiredOrBad: false
    }
  },
  methods: {
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
      let regForVerificationCode = /^\d{6}$/;
      if (!this.isFirst) {
        this.isExpiredOrBad = false;
        if (!this.isNotCorrect) {
          let myInput = e.target.value;
          if (myInput === '') {
            this.inputClass["border-bottom"] = "1px solid red";
            this.isMatch = false;
          } else if (!regForVerificationCode.test(myInput)) {
            this.inputClass["border-bottom"] = "1px solid red";
            this.isMatch = false;
          } else {
            this.inputClass["border-bottom"] = "1px solid darkblue";
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
      let regForVerificationCode = /^\d{6}$/;
      this.isFirst = false;
      this.isMatch = true;
      this.isNotCorrect = false;
      if (this.inputVerificationCode === '') {
        this.inputClass["border-bottom"] = "1px solid red";
        this.isMatch = false;
      } else if (!regForVerificationCode.test(this.inputVerificationCode)) {
        this.inputClass["border-bottom"] = "1px solid red";
        this.isMatch = false;
      } else {
        axios.post(`http://localhost:8888/verify/verifyVerificationCode?email=${this.email}&verificationCode=${this.inputVerificationCode}`)
            .then(response => {
              if (response.data.code === 200) {
                this.inputClass["border-bottom"] = "1px solid darkblue";
                axios.get(`http://localhost:8888/log/insertAccount?email=${this.email}&password=${this.password}`)
                    .then(response => {
                      if (response.data.code === 200) {
                        //跳转回登录界面
                        this.$router.push('/login');
                      } else {
                        alert("失败");
                      }
                    })
                    .catch(error => {
                      console.log(error.message);
                    })

                this.$router.push('/login');
              } else {
                this.isExpiredOrBad = true;
                console.log(response.data.message);
              }
            })
            .catch(error => {
              console.log(error.message);
            })
        //  调用创建接口

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

#repeat:hover {
  cursor: pointer;
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


.fade-enter-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>