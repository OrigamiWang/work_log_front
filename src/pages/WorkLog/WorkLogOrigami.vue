<template>
  <div>
    <div class="bigFont">
      {{ sayHello }}好，<a href="http://localhost:8080/#/WorkLogFrame/info" id="a1">Origami</a>
    </div>
    <div>
      <h1>
        现在时间：{{ newDate }}
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkLogOrigami",


  mounted() {
    // 挂载时间
    let that = this
    this.timer = setInterval(function () {
      that.newDate = new Date().toLocaleString()
    })

    let hour = new Date().getHours();
    if (hour >= 3 && hour <= 5) {
      this.sayHello = "凌晨";
    } else if (hour >= 6 && hour <= 7) {
      this.sayHello = "早晨";
    } else if (hour >= 8 && hour <= 10) {
      this.sayHello = "上午";
    } else if (hour >= 11 && hour <= 12) {
      this.sayHello = "中午";
    } else if (hour >= 13 && hour <= 16) {
      this.sayHello = "下午";
    } else if (hour >= 17 && hour <= 18) {
      this.sayHello = "傍晚";
    } else if (hour >= 19 && hour <= 22) {
      this.sayHello = "晚上";
    } else if (hour >= 23 && hour <= 2) {
      this.sayHello = "深夜";
    }

  },
  // 销毁时清除计时器
  beforeDestroy: function () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  data() {
    return {
      sayHello: '',
      newDate: new Date(),
    }
  },
}
</script>

<style scoped>
a {
  color: black;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.bigFont {
  font-size: x-large;
  font-weight: bold;
}
</style>