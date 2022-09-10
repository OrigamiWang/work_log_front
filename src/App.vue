<template>
  <div>
    <router-view v-if="isRouterAlive"></router-view>
    <h1></h1>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      isRouterAlive: true,
    }
  },
  provide() {
    return {
      reload: this.reload,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {this.isRouterAlive = true;})
    }
  },

}
</script>


<style>
/* 让el-container充满全屏  */
html,body,#app,.el-container {
  margin: 0;
}

</style>
