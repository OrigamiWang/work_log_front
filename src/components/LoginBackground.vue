<template>
  <div>
    <vue-particles
        class="background"
        color="#fff"
        :particleOpacity="1"
        :particlesNumber="125"
        shapeType="circle"
        :particleSize="4"
        linesColor="#fff"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="1.5"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
    >
    </vue-particles>
    <el-container class="loginbody">
      <el-container style="background-color: rgba(0,0,0,0.3) ;border-radius: 5px" class="logindata">
        <el-container style="margin: 30px">
          <el-header class="logintext" style="height: 50px; padding: 0px">
            <el-image :src="require('../assets/origamiLogoWhite.png')" fit="cover" style="height: 28px">
            </el-image>
          </el-header>
          <transition :name="transitionName">
            <router-view></router-view>
          </transition>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "LoginBackground",

  watch: {
    $route(to, from) {
      // 切换动画
      // 通过meta属性自定义一个tree值来判断同级路由的先后顺序
      if (to.meta.tree < from.meta.tree) {
        //后退，向右滑动
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
    }
  },
  data() {
    return {
      transitionName: 'slide-right' // 初始过渡动画方式
    }
  },
};
</script>

<style scoped>
.loginbody {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
  padding-top: 10%;
}

.logindata {
  background-color: white;
  height: 70%;
  margin-left: 37%;
  margin-right: 37%;
}


.slide-left-enter {
  opacity: 0;
  transform: translateX(100%)
}

.slide-right-leave-to {
  display: none
}

.slide-left-leave-to {
  display: none
}

.slide-right-enter {
  opacity: 0;
  transform: translateX(-100%)
}

.slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active {
  transition: 1s;
}

#particles-js {
  width: 100%;
  height: 100%;
  position: fixed;
}

.background {
  background-image: url("../assets/hoshizora.jpg");
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
}
</style>

