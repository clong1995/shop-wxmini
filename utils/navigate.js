const check = require('../utils/check');
const navigateStorage = require('../storage/navigate');
const loginTo = page => {
    if (check.isLogin()) {//已经登入
        wx.navigateTo({
            url: page
        })
    } else {//未登入
        //写入存储
        navigateStorage.set(page)
        //跳到登录页面
        wx.redirectTo({
            url: "/pages/login/index"
        });
    }
}

const loginToGet = () => {
    return navigateStorage.get();
}


const loginToRemove = () => {
    navigateStorage.del();
}

module.exports = {
    loginTo,
    loginToRemove,
    loginToGet
}
