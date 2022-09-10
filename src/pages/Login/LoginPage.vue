<template>
  <div>
    <login-background>
      <router-view></router-view>
    </login-background>
  </div>
</template>

<script>
import loginBackground from "@/components/LoginBackground";

export default {
  name: "LoginPage",
  components: {loginBackground},
}
</script>

<style scoped>

</style>