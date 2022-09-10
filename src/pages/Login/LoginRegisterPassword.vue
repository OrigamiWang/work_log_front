<template>
  <el-container>
    <router-link :to="`/login?empId=${email}`" style="height: 45px">
      <i style="color: white" class="el-icon-back">{{ email }}</i>
    </router-link>
    <el-header style="color: white; height: 50px;padding: 0" class="bigFont">创建密码</el-header>
    <div style="color:white; height: 40px">为帐户输入您想要使用的密码。</div>
    <transition name="fade">
      <div style="color: red; height: 50px;line-height: 20px" v-show="!isMatch">
        密码必须至少包含 6 个字符，至少包含一个字母和一个数字，不能使用特殊符号。
      </div>
    </transition>
    <div style="height: 60px">
      <input
          @input="judge"
          v-focus
          autofocus
          v-model="password"
          id="input1"
          :type="type"
          :style="inputClass"
          @keyup.enter="toLog"
          placeholder="创建密码"/>
    </div>
    <label style="height: 40px">
      <input style="height: 20px; width: 20px; margin: 8px" type="checkbox" @click="showPassword">
      <span style="color: white" class="hand">显示密码</span>
    </label>
    <div class="loginBtn">
      <input @click="toLog" id="input2" type="submit" value="下一步">
    </div>
  </el-container>
</template>

<script>
export default {
  name: "LoginRegisterPassword",
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  data() {
    return {
      email: this.$route.query.email,
      password: '',
      inputClass: {
        'border-bottom': '1px solid darkblue',
        'border-top': '0px',
        'border-left': '0px',
        'border-right': '0px',
        'height': '40px',
        'width': '350px',
        'outline': 'none',
      },
      isMatch: true,
      existEmail: '',
      isFirst: true,
      type: "password",

    }
  },
  methods: {
    showPassword() {
      if (this.type === 'password') {
        this.type = "text";
      } else {
        this.type = "password";
      }
    },
    judge() {
      //如果已经点击了按钮，实时判断密码是否符合规范
      if (!this.isFirst) {
        let regForPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (this.password === '') {
          //密码为空
          this.isMatch = false;
          this.inputClass["border-bottom"] = "1px solid red";
        } else if (!regForPassword.test(this.password) && this.password !== '') {
          //密码不为空且不匹配
          this.isMatch = false;
          this.inputClass["border-bottom"] = "1px solid red";
        } else {
          this.inputClass["border-bottom"] = "1px solid darkblue";
          this.isMatch = true;
        }
      }
    },
    toLog() {
      this.isFirst = false;
      if (this.password === '') {
        this.isMatch = false;
        this.inputClass["border-bottom"] = "1px solid red";
        return;
      }
      let regForPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!regForPassword.test(this.password)) {
        //不匹配
        this.isMatch = false;
        this.inputClass["border-bottom"] = "1px solid red";
      } else {
        //如果密码符合规范
        //下一步
        this.inputClass["border-bottom"] = "1px solid darkblue";
        // 跳转至发送邮件
        this.$router.push({
          path: `/login/LoginSendMail?email=${this.email}&password=${this.password}`,
          query: {
            email: this.email,
            password: this.password
          }
        });
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

.hand:hover {
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
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>