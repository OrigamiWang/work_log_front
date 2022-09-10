<template>

</template>

<script>

export default {
  name: "NotFound",
  mounted() {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://volunteer.cdn-go.cn/404/latest/404.js';
    document.body.appendChild(script);
  },
}
</script>

<style scoped>

</style>