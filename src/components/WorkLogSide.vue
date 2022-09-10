<template>
  <el-aside width="200px" style="background-color: #545c64;">
    <el-menu
             router
             default-active="1"
             :default-openeds="['1', '2', '3']"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">

      <el-submenu index="1">
        <template slot="title"><i class="el-icon-s-home"></i>{{ $t("Side.MainPage") }}</template>
        <el-menu-item index="/WorkLogFrame/WorkLogHome">
          <i class="el-icon-info" style="color: white;"></i>
          {{ $t("Side.Detail") }}
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i>{{ $t("Side.Function") }}</template>
        <el-menu-item index="/WorkLogFrame/detail">
          <i class="el-icon-edit-outline" style="color: white;"></i>
          {{ $t("Side.WorkLog") }}
        </el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i>{{ $t("Side.Setting") }}</template>
        <el-menu-item v-show="isShow" index="/WorkLogFrame/permission">
          <i class="el-icon-s-management" style="color: white;"></i>
          {{ $t("Side.Permission") }}
        </el-menu-item>

        <el-menu-item index="/WorkLogFrame/info">
          <i class="el-icon-s-custom" style="color: white;"></i>
          {{ $t("Side.Information") }}
        </el-menu-item>
      </el-submenu>

    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "WorkLogSide",
  mounted() {
    this.ifShow();
  },
  data() {
    return {
      isShow: true,
    }
  },
  methods: {
    ifShow() {
      if (!localStorage.getItem('roles').includes('root')) {
        this.isShow = false;
      }
    }
  }
}
</script>

<style scoped>
.el-aside {
  height:100vh;
}
</style>