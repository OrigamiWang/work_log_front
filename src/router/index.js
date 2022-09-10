import VueRouter from 'vue-router';
import WorkLogHome from "@/pages/WorkLog/WorkLogHome";
import WorkLogDetail from "@/pages/WorkLog/WorkLogDetail";
import WorkLogInfo from "@/pages/WorkLog/WorkLogInfo";
import LoginAccount from "@/pages/Login/LoginAccount";
import LoginRegister from "@/pages/Login/LoginRegister";
import LoginEmail from "@/pages/Login/LoginEmail";
import LoginEmpId from "@/pages/Login/LoginEmpId";
import LoginResetPassword from "@/pages/Login/LoginResetPassword";
import LoginVerification from "@/pages/Login/LoginVerification";
import LoginRegisterPassword from "@/pages/Login/LoginRegisterPassword";
import LoginSendMail from "@/pages/Login/LoginSendMail";
import LoginAuthentication from "@/pages/Login/LoginAuthentication";
import LoginPage from "@/pages/Login/LoginPage";
import WorkLogFrame from "@/components/WorkLogFrame";
import axios from "axios";
import WorkLogPermission from "@/pages/WorkLog/WorkLogPermission";
import BadPriority from "@/pages/error/BadPriority";
import NotFound from "@/pages/error/NotFound";
import WorkLogOrigami from "@/pages/WorkLog/WorkLogOrigami";

const router = new VueRouter({
    routes: [
        {
            path: '/BadPriority',
            name: 'BadPriority',
            component: BadPriority,
        },
        {
            path: '/WorkLogFrame',
            name: 'WorkLogFrame',
            meta: {
                noNeedLogin: false,
                title: '工作日志填报系统'
            },
            component: WorkLogFrame,
            children: [
                {
                    path: 'WorkLogOrigami',
                    name: 'WorkLogOrigami',
                    component: WorkLogOrigami
                },
                {
                    path: 'WorkLogHome',
                    name: 'WorkLogHome',
                    component: WorkLogHome,
                },
                {
                    path: 'detail',
                    name: 'WorkLogDetail',
                    component: WorkLogDetail
                },
                {
                    path: 'info',
                    name: 'WorkLogInfo',
                    component: WorkLogInfo
                },
                {
                    path: 'permission',
                    name: 'WorkLogPermission',
                    component: WorkLogPermission,
                    meta: {
                        roles: ['root'],
                    },
                    beforeEnter(to, from, next) {
                        if (localStorage.getItem('roles').includes('root')) {
                            next();
                        } else {
                            next('/BadPriority');
                        }
                    }
                },

            ]
        },
        {
          path: '',
          beforeEnter(to, from, next) {
              next("/Login");
          }
        },
        {
            path: '/Login',
            component: LoginPage,
            meta: {
                login: 'login',
                noNeedLogin: false,
                tree: 1,
            },
            children: [
                {
                    path: '',
                    name: 'LoginAccount',
                    component: LoginAccount,
                    meta: {
                        noNeedLogin: true,
                        tree: 1,
                    }
                },
                {
                    path: 'LoginRegister',
                    name: 'LoginRegister',
                    component: LoginRegister,
                    meta: {
                        noNeedLogin: true,
                        tree: 2,
                    }
                },
                {
                    path: 'LoginEmail',
                    name: 'LoginEmail',
                    component: LoginEmail,
                    meta: {
                        noNeedLogin: true,
                        tree: 2,
                    },
                    beforeEnter(to, from, next) {
                        if (from.name === 'WorkLogFrame') {
                            next({name: 'LoginAccount'});
                        } else {
                            next();
                        }
                    }
                },
                {
                    path: 'LoginEmpId',
                    name: 'LoginEmpId',
                    component: LoginEmpId,
                    meta: {
                        noNeedLogin: true,
                        tree: 2,
                    }
                },
                {
                    path: 'LoginResetPassword',
                    name: 'LoginResetPassword',
                    component: LoginResetPassword,
                    meta: {
                        noNeedLogin: true,
                        tree: 4,
                    },
                    beforeEnter(to, from, next) {
                        if (from.name === 'LoginAccount') {
                            next({name: 'LoginAccount'});
                        } else {
                            next();
                        }
                    }
                },
                {
                    path: 'LoginVerification',
                    name: 'LoginVerification',
                    component: LoginVerification,
                    meta: {
                        noNeedLogin: true,
                        tree: 3,
                    },
                },
                {
                    path: 'LoginRegisterPassword',
                    name: 'LoginRegisterPassword',
                    component: LoginRegisterPassword,
                    meta: {
                        noNeedLogin: true,
                        tree: 3,
                    }
                },
                {
                    path: 'LoginSendMail',
                    name: 'LoginSendMail',
                    component: LoginSendMail,
                    meta: {
                        noNeedLogin: true,
                        tree: 4,
                    },
                    beforeEnter(to, from, next) {
                        if (from.name === 'LoginAccount') {
                            next({name: 'LoginAccount'});
                        } else {
                            next();
                        }
                    },
                },
                {
                    path: 'LoginAuthentication',
                    name: 'LoginAuthentication',
                    component: LoginAuthentication,
                    meta: {
                        noNeedLogin: true,
                        tree: 3,
                    },
                    beforeEnter(to, from, next) {
                        if (from.name === 'LoginAccount') {
                            next({name: 'LoginAccount'});
                        } else {
                            next();
                        }
                    }
                }
            ]
        },
        {
            name: '404',
            path: '/404.html',
            component: NotFound
        },
        {
            path: '*',
            redirect: {
                name: "404"
            }
        }
    ],
})

router.beforeEach((to, from, next) => {
    if (to.meta.noNeedLogin) {
        console.log("放行1")
        next();
    } else {
        let token = localStorage.getItem('Authorization');
        axios.get(`http://localhost:8888/login/judgeLogin?token=${token}`)
            .then(response => {
                if (token === null || token === '' || response.data.code !== 200) {
                    console.log("拦截")
                    localStorage.removeItem("roles");
                    localStorage.removeItem("Authorization");
                    localStorage.removeItem("email");
                    localStorage.removeItem("empId");
                    localStorage.removeItem("password");
                    next('/Login');
                } else {
                    console.log("放行2")
                    next();
                }
            })
            .catch(error => {
                console.log(error.message);
            })


    }
});

export default router;

