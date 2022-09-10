<template>
  <div>
    <el-descriptions :title="$t('Info.Title')">
      <el-descriptions-item :label="$t('Info.EmpId')">{{empId}}</el-descriptions-item>
      <el-descriptions-item :label="$t('Info.Email')">{{email}}</el-descriptions-item>
      <el-descriptions-item v-if="priority.includes('user')" :label="$t('Info.Permission')">{{$t('Info.p1')}}</el-descriptions-item>
      <el-descriptions-item v-else :label="$t('Info.Permission')">{{$t('Info.p2')}}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  name: "WorkLogInfo",
  mounted() {
    if(localStorage.getItem('roles')) {
      this.priority = localStorage.getItem('roles');
    }
  },
  data() {
    return {
      priority: '',
      empId: window.localStorage.getItem('empId'),
      email: window.localStorage.getItem('email'),
      password: window.localStorage.getItem('password'),
    }
  }
}
</script>

<style scoped>

</style>