<template>
  <el-main>
    <router-view></router-view>
  </el-main>
</template>
<script>
export default {
  name: "WorkLogMain",
}
</script>

<style scoped>
.el-main {
  background-color: #F7FAFD;
  /*去掉el-main内边框*/
  padding: 0;
}

</style>