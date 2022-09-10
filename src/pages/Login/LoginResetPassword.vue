<template>
  <el-container>
    <el-header style="color:white; height: 40px;padding: 0" class="bigFont">重新设置密码</el-header>
    <div style="color:white; height: 40px; font-size: 11px"> 最少6个字符，区分大小写，至少一个字母和一个数字</div>
    <div style="color: red; height: 50px;line-height: 20px" v-show="!isMatch">
      密码必须至少包含 6 个字符，至少包含一个字母和一个数字，不能使用特殊符号。
    </div>
    <div style="color: red; height: 30px;line-height: 20px" v-show="isNull">
      此信息为必填项
    </div>
    <div style="height: 55px">
      <input
          v-focus
          autofocus
          v-model="password"
          id="input1"
          :type="type"
          :style="inputClass"
          @keyup.enter="toLog"
          placeholder="新密码"/>
    </div>
    <div style="color: red; height: 30px;line-height: 20px" v-show="isNull2">
      此信息为必填项
    </div>
    <div style="color: red; height: 30px;line-height: 20px" v-show="isNotSame">
      这些密码不匹配
    </div>
    <div style="height: 60px">
      <input
          v-model="password2"
          id="input4"
          :type="type"
          :style="inputClass"
          @keyup.enter="toLog"
          placeholder="重新输入密码"/>
    </div>

    <div class="loginBtn">
      <input @click="back" id="input3" type="submit" value="取消">&nbsp;<input @click="toLog" id="input2" type="submit"
                                                                             value="下一步">
    </div>
  </el-container>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginResetPassword",
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
      password2: '',
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
      isNull: false,
      isNull2: false,
      isNotSame: false,
      type: "password",

    }
  },
  methods: {
    back() {
      this.$router.push({path: "/login"});
    },
    showPassword() {
      if (this.type === 'password') {
        this.type = "text";
      } else {
        this.type = "password";
      }
    },
    toLog() {
      let regForPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (this.password === '') {
        //密码为空
        this.isMatch = true;
        this.isNotSame = false;
        this.isNull = true;
        this.isNull2 = false;
      } else {
        //第一个密码不为空
        this.isNull = false;
        if (this.password2 === '') {
          //第二个密码为空
          this.isNull2 = true;
        } else {
          // 第二个密码不为空
          this.isNull2 = false;
          if (!regForPassword.test(this.password)) {
            //第一个密码不匹配
            this.isMatch = false;
          } else {
            //第一个密码匹配
            this.isMatch = true;
            if (this.password !== this.password2) {
              //第一个与第二个密码不等
              this.isNotSame = true;
            } else {
              //相等
              this.isNotSame = false;
              console.log(this.password);
              console.log(this.email);
              axios.get(`http://localhost:8888/login/updatePassword?password=${this.password}&email=${this.email}`)
              .then(response => {
                if(response.data.code === 200) {
                  this.$router.push('/login');
                } else {
                  alert("错误");
                }
              })
              .catch(error => {
                console.log(error.message);
              })

            }
          }
        }
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
</style>