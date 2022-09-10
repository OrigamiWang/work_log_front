<template>
  <el-container direction="vertical">
    <work-log-header></work-log-header>
    <el-container>
      <work-log-side></work-log-side>
      <work-log-main></work-log-main>
    </el-container>
    <work-log-footer></work-log-footer>
  </el-container>
</template>

<script>
import WorkLogHeader from "@/components/WorkLogHeader";
import WorkLogFooter from "@/components/WorkLogFooter";
import WorkLogSide from "@/components/WorkLogSide";
import WorkLogMain from "@/components/WorkLogMain";

export default {
  name: "WorkLogFrame",
  components: {WorkLogSide, WorkLogHeader, WorkLogFooter, WorkLogMain},

}
</script>
