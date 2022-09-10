// 创建文件zh.js
const zh = {
    Head: {
        Admin: '日志填报系统',
        Logout: '注销',
    },
    Side: {
        MainPage: '主页',
        Detail: '详情',
        Function: '功能',
        WorkLog: '日志填报',
        Setting: '设置',
        Information: '个人资料',
        Permission: '权限管理',
    },
    Detail: {
        Add: '新增',
        No: '序号',
        EmpId: '工号',
        Name: '姓名',
        Date: '日期',
        WorkTime: '时长',
        Content: '内容',
        Edit: '编辑',
        Del: '删除',
        Search: '输入工号搜索',
    },
    Info: {
        EmpId: '工号',
        Email: '邮箱',
        Permission: '权限',
        p1: '用户',
        p2: '管理员',
        Title: '用户信息'
    },
    Permission: {
        No: '序号',
        EmpId: '工号',
        Priority: '权限',
        name: '设置',
        p1: '管理员',
        p2: '用户',
    },
    pagination: {
        pagesize: '条/页',
    },
    languageSet: '中文',
    language: {
        zh: '中文',
        en: 'English',
    },
    Dialog: {
        addTitle: '添加日志',
        editTitle: '修改日志',
        EmpId: '工号',
        Name: '姓名',
        Time: '时间',
        WorkTime: '时长',
        Content: '内容',
        Submit: '提交',
        Reset: '重置',
        Alert: {
            EmpIdMsg1: '请输入工号',
            NameMsg1: '请输入姓名',
            ContentMsg1: '请输入内容',
            LogDayMsg: '请输入日期',
            workTimeMsg: '请输入时间',
        },
        AlertDel: {
            title: '提示',
            msg: '删除后无法恢复,您确定要删除吗?',
            yes: '确定',
            no: '取消'
        },
        AlertLogout: {
            title: '提示',
            msg: '注销后需要重新登陆，您确定要注销吗?',
            yes: '确定',
            no: '取消'
        }
    },

}
export default zh;
