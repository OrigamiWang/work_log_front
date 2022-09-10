// 创建文件en.js
const en = {
    Head: {
        Admin: 'WorkLogSystem',
        Logout: 'Logout',

    },
    Side: {
        MainPage: 'MainPage',
        Detail: 'Detail',
        Function: 'Function',
        WorkLog: 'WorkLog',
        Setting: 'Setting',
        Information: 'Information',
        Permission: 'Permission',

    },
    Detail: {
        Add: 'Add',
        No: 'No',
        EmpId: 'EmpId',
        Name: 'Name',
        Date: 'Date',
        WorkTime: 'WorkTime',
        Content: 'Content',
        Edit: 'Edit',
        Del: 'Del',
        Search: 'Search by empId',
    },
    Info: {
        EmpId: 'EmpId',
        Email: 'Email',
        Permission: 'Permission',
        p1: 'User',
        p2: 'Root',
        Title: 'Information',
    },
    Permission: {
        No: 'No',
        EmpId: 'EmpId',
        Priority: 'Permission',
        name: 'Setting',
        p1: 'Root',
        p2: 'user',
    },
    languageSet: 'English',
    language: {
        zh: '中文',
        en: 'English',
    },
    pagination: {
        pagesize: '/page',
    },
    Dialog: {
        addTitle: 'Add',
        editTitle: 'Edit',
        EmpId: 'EmpId',
        Name: 'Name',
        Time: 'Time',
        Content: 'Content',
        WorkTime: 'WorkTime',
        Submit: 'Submit',
        Reset: 'Reset',
        Alert: {
            EmpIdMsg1: 'Please input empId',
            NameMsg1: 'Please input name',
            ContentMsg1: 'Please input content',
            LogDayMsg: 'Please input date',
            workTimeMsg: 'Please input time'
        },
        AlertDel: {
            title: 'Alert',
            msg: 'It cannot be restored after deletion. Make sure you want to delete it',
            yes: 'Sure',
            no: 'Cancel'
        },
        AlertLogout: {
            title: 'Alert',
            msg: 'You need to log back in after logging out, are you sure you want to log out?',
            yes: 'Sure',
            no: 'Cancel'
        },
    },
}
export default en;
