<template>
  <el-container>
    <el-header style="color: white; height: 50px;padding: 0" class="bigFont">创建账户</el-header>
    <transition name="fade">
      <div style="color: red; height: 50px;line-height: 20px" v-show="!isMatch">
        输入 someone@example.com 格式的电子邮件地址。
      </div>
    </transition>
    <transition name="fade">
      <div style="color: red; height: 50px;line-height: 20px" v-show="isExist">
        {{ email }} 已经是一个 Origami 帐户。请尝试使用其他电子邮件地址。
      </div>
    </transition>
    <div style="height: 55px">
      <input
          autofocus
          v-focus
          @input="judge"
          v-model="email"
          id="input1"
          type="text"
          :style="inputClass"
          @keyup.enter="toLog"
          placeholder="someone@example.com"/>
    </div>
    <div class="loginBtn">
      <input @click="toLog" id="input2" type="submit" value="下一步">
    </div>
  </el-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "LoginRegister",
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  data() {
    return {
      email: '',
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
      isExist: false,
      existEmail: '',
      isFirst: true,

    }
  },
  methods: {
    judge(e) {

      //如果已经点击了按钮，实时判断邮箱是否符合规范
      if (!this.isFirst) {
        let regForEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{1,6}$/;
        if (!regForEmail.test(this.email)) {
          //不匹配
          this.isMatch = false;
          this.inputClass["border-bottom"] = "1px solid red";
        } else {
          this.inputClass["border-bottom"] = "1px solid darkblue";
          this.isMatch = true;
        }
      }
      //判断邮箱是否被注册过
      if (e.target.value === this.existEmail && e.target.value !== '') {
        this.inputClass["border-bottom"] = "1px solid red";
        this.isExist = true;
      } else {
        this.inputClass["border-bottom"] = "1px solid darkblue";
        this.isExist = false;
      }

    },
    toLog() {
      this.isFirst = false;

      let regForEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{1,6}$/;
      if (!regForEmail.test(this.email)) {
        //不匹配
        this.isMatch = false;
        this.inputClass["border-bottom"] = "1px solid red";
      } else {
        //如果邮箱符合规范
        //先判断改邮箱是否被注册过
        axios.get('http://localhost:8888/login/getEmailList')
            .then(response => {
              let emailList = response.data.data;
              let hasEmail = false;
              for (let i in emailList) {
                if (this.email === emailList[i]) {
                  hasEmail = true;
                  this.existEmail = emailList[i];
                  break;
                }
              }
              if (hasEmail) {
                this.inputClass["border-bottom"] = "1px solid red";
                this.isExist = true;
              } else {
                this.inputClass["border-bottom"] = "1px solid darkblue";
                this.$router.push({path: "/login/LoginRegisterPassword", query: {email: this.email}});
              }
            })
            .catch(error => {
              console.log(error.message);
            })
      }
    }
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