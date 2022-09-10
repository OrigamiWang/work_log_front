<template>
  <el-container>
    <el-header style="color:white; height: 40px;padding: 0" class="bigFont">验证你的身份</el-header>
    <div style="color:white; height: 23px; font-size: 14px">点击向 <b>{{ email }} </b>发送一个代码。</div>
    <div style="color:white; height: 23px; font-size: 14px">请查看你的电子邮件中来自 Origami 帐户团队的邮</div>
    <div style="color:white; height: 40px; font-size: 14px">件，然后在此处输入代码。</div>

    <transition name="fade">
      <div style="color: red; height: 35px;line-height: 20px" v-show="!isMatch">
        请输入 6 位代码。该代码仅包含数字。
      </div>
    </transition>
    <transition name="fade">
      <div style="color: red; height: 35px;line-height: 20px" v-show="isNotCorrect">
        该代码无效。检查该代码并重试。
      </div>
    </transition>
    <input
        v-focus
        autofocus
        maxlength="6"
        @input="judge"
        v-model="inputVerificationCode"
        id="input1"
        type="text"
        :style="inputClass"
        @keyup.enter="toLog"
        placeholder="输入代码"/>

    <div style="height: 5%"></div>
    <button id="input4" :type="type" :disabled="disabled" @click="getVerificationCode">{{ time }}</button>

    <div class="loginBtn">
      <input @click="back" id="input3" type="submit" value="取消">&nbsp;<input @click="toLog" id="input2" type="submit"
                                                                               value="下一步">
    </div>
  </el-container>


</template>

<script>
import axios from 'axios';

export default {
  name: "LoginAuthentication",
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
      email: this.$route.query.email,
      inputVerificationCode: '',
      inputClass: {
        'border-bottom': '1px solid darkblue',
        'border-top': '0px',
        'border-left': '0px',
        'border-right': '0px',
        'height': '10%',
        'width': '290px',
        'outline': 'none',
      },
      isMatch: true,
      isNotCorrect: false,
      isFirst: true,
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
      }, 1000)
    },
    back() {
      this.$router.push({path: "/login"});
    },
    judge(e) {
      let regForVerificationCode = /^\d{6}$/;
      if (!this.isFirst) {
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
            if (response.data.code === 200) {
              this.verificationCode = response.data.data;
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
        this.isMatch = false;
        this.inputClass["border-bottom"] = "1px solid red";
      } else if (!regForVerificationCode.test(this.inputVerificationCode)) {
        this.isMatch = false;
        this.inputClass["border-bottom"] = "1px solid red";
      } else if (this.inputVerificationCode !== this.verificationCode) {
        this.isNotCorrect = true;
        this.inputClass["border-bottom"] = "1px solid red";
      } else {
        //跳转到重新设置密码页面
        this.inputClass["border-bottom"] = "1px solid darkblue";
        this.$router.push({path: `/login/LoginResetPassword?email=${this.email}`})
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

#input4 {
  width: 60px;
  height: 32px
}

#input3 {
  background-color: #ccc8c8;
  border: none;
  width: 108px;
  height: 32px;
}

#input3:hover {
  background-color: #adaaaa;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

</style>