<template>
  <div>
    <el-header
        style="padding: 13px">
      <el-row>
        <el-col :span="2">
          <el-image @click="toOrigami" :src="require('../assets/origamiLogoWhite.png')" fit="cover"
                    style="height: 35px; cursor: pointer">
          </el-image>
        </el-col>
        <el-col :span="2" :offset="16">
          <el-dropdown @command="handleCommand" id="dropdown1">
            <span class="el-dropdown-link;" style="color: white; font-size: large">
              {{ $t("languageSet") }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh">中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>


        <el-col :span="1">
          <router-link v-show="isLogin" to="/WorkLogFrame/info"
                       style="color: white; text-decoration: none;margin-top: 50%">
            <span style="font-size: 20px">{{ empId }}</span>
          </router-link>
        </el-col>

        <el-col :span="1">
          <div class="block avatar_icon">
            <el-avatar :size="30" :src="circleUrl" @error="errorHandler" @click.native="toAddAvatarPage"></el-avatar>
          </div>
        </el-col>

        <el-col :span="1">
          <a @click="logout" id="logout">{{ $t("Head.Logout") }}</a>
        </el-col>
      </el-row>
    </el-header>

    <el-dialog

        :title="$t('Dialog.AlertLogout.title')"
        style="text-align:left !important"
        :visible.sync="dialogVisible"
        :before-close="closeLogout">
      <span>{{ $t("Dialog.AlertLogout.msg") }}</span>
      <span slot="footer" class="dialog-footer">
              <el-button @click="handleLogout">{{ $t("Dialog.AlertLogout.yes") }}</el-button>
              <el-button type="primary" @click="cancelLogout">{{ $t('Dialog.AlertLogout.no') }}</el-button>
            </span>
    </el-dialog>

    <el-dialog
        title="上传头像"
        :visible.sync="addAvatarVisible"
        width="50%"
    >
      <input id="file" class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg"
             @change="getAvatarFileName($event)"/>
      <button @click="uploadAvatar($event)">提交</button>
    </el-dialog>


  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "WorkLogHeader",
  mounted() {
    //显示头像，先从minIO查找该用户是否上传头像
    //写一个查找用户是否上传头像的接口。。。
    axios.post(`http://localhost:8888/avatar/load?empId=${this.empId}`)
        .then(response => {
          if (response.data.code === 200) {
            // 说明用户上传过头像，那么进行一个头像的获取
            //由于获取头像有时间，那么在获取到头像之前加一个加载过渡动画
            const loading = this.$loading({
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.circleUrl = `http://minio.origami.wang/avatar/avatar${this.empId}`;
            //关闭加载动画
            loading.close();
            this.fullscreenLoading = false;

          } else {
            //否则使用默认头像
            this.circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
          }
        })

    if (localStorage.getItem('Authorization') !== null) {
      this.isLogin = true;
      this.empId = window.localStorage.getItem("empId");
      this.email = window.localStorage.getItem("email");
      this.password = window.localStorage.getItem("password");
    } else {
      this.isLogin = false;
    }
  },
  beforeDestroy() {

  },
  data() {
    return {
      fullscreenLoading: false,
      file: '',
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      dialogVisible: false,
      addAvatarVisible: false,
      isLogin: true,
      empId: localStorage.getItem("empId"),
      email: '',
      password: '',
    }
  },

  methods: {
    getAvatarFileName: function (event) {
      this.file = event.target.files[0];
    },
    toAddAvatarPage() {
      this.addAvatarVisible = true;
    },
    uploadAvatar(event) {
      const MAX_FILE_SIZE = 1024 * 1024;
      let flag = true;
      if (this.file.size > MAX_FILE_SIZE) {
        //文件过大
        flag = false;
        this.$message({
          showClose: true,
          message: '上传文件不得超过1M ',
          type: 'warning'
        });
      }
      if (flag === true) {
        const loading = this.$loading({
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        event.preventDefault();
        let formData = new FormData();
        formData.append('file', this.file);
        formData.append('empId', this.empId);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }

        axios.post('http://localhost:8888/avatar/upload', formData, config)
            .then(response => {
              if (response.data.code === 200) {
                this.circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
                this.circleUrl = response.data.data.url;
                this.addAvatarVisible = false;
                window.location.reload();
                loading.close();
              }
            })
      }
    },
    errorHandler() {
      return true;
    },
    toOrigami() {
      this.$router.push('/WorkLogFrame/WorkLogOrigami');
    },
    cancelLogout() {
      this.dialogVisible = false;
      this.$message({
        showClose: true,
        message: '取消注销 ',
        type: 'info'
      });
    },
    handleLogout() {
      //注销
      //清除token
      this.dialogVisible = false;
      localStorage.removeItem('roles');
      localStorage.removeItem('Authorization');
      localStorage.removeItem('email');
      localStorage.removeItem('empId');
      localStorage.removeItem('password');
      this.$router.push('/Login');
    },
    closeLogout(done) {
      this.$message({
        showClose: true,
        message: '取消注销 ',
        type: 'info'
      });
      done();
    },
    logout() {
      this.dialogVisible = true;
    },
    changeLanguage(type) {
      // 切换语言
      this.$i18n.locale = type
    },
    handleCommand(command) {
      this.changeLanguage(command);
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #404b56;
}

#dropdown1 {
  cursor: pointer;
  font-size: 20px;
}

#logout {
  color: white;
  cursor: pointer;
  font-size: 20px
}

#logout:hover {
  text-decoration: underline;
  color: #3f7bb7;
}


.userIcon :hover {
  cursor: pointer;
}

.avatar_icon :hover {
  cursor: pointer;
}
</style>