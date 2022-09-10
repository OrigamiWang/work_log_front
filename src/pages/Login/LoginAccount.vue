<template>
  <el-container>
    <el-header style="height: 35px;padding: 0; color: white"  class="bigFont">登录</el-header>
    <transition name="fade">
      <div style="color: red; height: 25px" v-show="invalidAccVisible && !isFirst">
        请输入有效的电子邮件地址或工号。
      </div>
    </transition>
    <transition name="fade">
      <div style="color: red; height: 25px" v-show="badEmail">
        该邮箱不存在！
      </div>
    </transition>
    <transition name="fade">
      <div style="color: red; height: 25px" v-show="badEmpId">
        该工号不存在！
      </div>
    </transition>
    <div style="height: 50px">
      <input
          autofocus
          v-focus
          @input="isValid"
          v-model="account"
          id="input1"
          type="text"
          :style="inputClass"
          @keyup.enter="toVerify"
          placeholder="邮箱或工号"/>
    </div>
    <div class="smallFont" style="color: white">
      没有帐户？
      <router-link style="color: #0051ff" to="/login/LoginRegister">创建一个!</router-link>
    </div>
    <div class="btnNext">
      <input id="input2" @click="toVerify" type="submit" value="下一步">
    </div>
  </el-container>
</template>


<script>
import axios from "axios";

export default {
  name: "LoginAccount",
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  mounted() {
    this.account = this.$route.query.empId;
  },
  data() {
    return {
      badEmail: false,
      badEmpId: false,
      //账号（邮箱或者工号）
      account: '',
      //无效邮箱提示：默认不提示
      invalidAccVisible: false,
      isFirst: true,
      inputClass: {
        'border-bottom': '1px solid darkblue',
        'border-top': '0px',
        'border-left': '0px',
        'border-right': '0px',
        'height': '30px',
        'width': '300px',
        'outline': 'none',
      }
    }
  },
  methods: {
    //验证账号是否有效
    isValid(e) {
      this.badEmpId = false;
      this.badEmail = false;
      let type = this.verify(e.target.value);
      this.invalidAccVisible = type === 0;
      if (this.invalidAccVisible && !this.isFirst) {
        this.$data.inputClass["border-bottom"] = '1px solid red';
      } else {
        this.$data.inputClass["border-bottom"] = '1px solid darkblue';
      }
    },
    toVerify() {
      this.isFirst = false;
      let type = this.verify(this.account);
      this.invalidAccVisible = type === 0;
      if (this.invalidAccVisible && !this.isFirst) {
        this.$data.inputClass["border-bottom"] = '1px solid red';
      } else {
        //执行路由跳转
        this.$data.inputClass["border-bottom"] = '1px solid darkblue';
      }
      if (type === 1) {
        //将该工号对应的邮箱也传过去，为了“忘记密码”的时候找回密码
        //先判断该工号是否存在
        let flag = false;
        axios.get('http://localhost:8888/login/getEmpIdList')
            .then(response => {
              let list = response.data.data;
              for (let i in list) {
                if (list[i] === this.account) {
                  flag = true;
                  break;
                }
              }
              if (flag) {
                axios.get(`http://localhost:8888/login/getEmailByEmpId?empId=${this.account}`)
                    .then(response => {
                      if (response.data.code === 200) {
                        let email = response.data.data;
                        this.$router.push({path: "/login/LoginEmpId", query: {empId: this.account, email: email}});
                      } else {
                        alert("异常");
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    })
              } else {
                this.badEmpId = true;
              }
            })
            .catch(error => {
              console.log(error.message);
            })

      } else if (type === 2) {
        let flag2 = false;
        axios.get("http://localhost:8888/login/getEmailList")
        .then(response => {
          let list = response.data.data;
          for(let i in list) {
            if(list[i] === this.account) {
              flag2 = true;
              break;
            }
          }
          if(flag2) {
            this.$router.push({path: "/login/LoginEmail", query: {email: this.account}});
          } else {
            this.badEmail = true;
          }
        })

      }


    },
    verify(acc) {
      /**
       * this.$router.replace('/xxx')
       * 通过这个语句进行路由
       * 先判断输入的是邮箱还是工号
       *
       * 如果是工号
       * this.$router.replace('/LoginEmpId')
       * 则输入密码
       *
       * 如果是邮箱
       * this.$router.replace('/LoginEmail')
       * 并自动给邮箱发送验证码
       * 输入验证码
       */
          // type 表示输入的账号的类型
          //type = 0 ---> 账号无效
          //type = 1 ---> 工号
          //type = 2 ---> 邮箱
      let type = 0;
      //邮箱格式
      let regForEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      //4-20位工号
      let regForEmpId = /^\d{4,20}$/;
      if (regForEmpId.test(acc)) {
        type = 1;
      } else if (regForEmail.test(acc)) {
        type = 2;
      }
      return type;
    }
  }

}
</script>

<style scoped>

.bigFont {
  font-size: x-large;
  font-weight: bold;
}


#input2:hover {
  cursor: pointer;
  background-color: #0f578f;
}


#input2 {
  width: 108px;
  height: 32px;
  background-color: #0067B8;
  color: white;
  border: none
}

input::-webkit-input-placeholder {
  font-size: 16px;
}

.smallFont {
  height: 100px;
  font-size: 13px;
}

.btnNext {
  text-align: right;
}

a {
  text-decoration: none;
  color: #0067B8;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

</style>