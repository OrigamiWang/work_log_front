import Vue from 'vue';
import App from './App.vue'
// 引入VueRouter
import VueRouter from 'vue-router'
// 引入路由器
import router from '@/router';
//饿了么
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import i18n from "@/vueIN";
import store from './vuex/store'

import VueParticles from 'vue-particles'
Vue.config.productionTip = false
// 应用插件
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueParticles)

new Vue({
    el: '#app',
    render: h => h(App),
    //注册全局事件总线
    beforeCreate() {
        Vue.prototype.$bus = this;
    },
    router: router,
    i18n: i18n,
    store: store,
})
