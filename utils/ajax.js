'use strict'
const check = require('../utils/check');
const config = require('../config');
const crypto = require('../utils/crypto');
const gd = getApp().globalData;
const ajax = (api = "/", {
    data = {},
    auth = true,
    loading = true,
    success = null,
    fail = null,
    complete = null,
} = {}) => {
    let end = false;
    let signature = "";
    let dataStr = "";
    if (auth) { //开启认证
        if (!check.isLogin()) {
            wx.showToast({
                title: '认证不存在',
                icon: 'none',
                duration: 2000
            })
            return
        } else {
            data["t"] = gd.token;
            data["d"] = "";
            dataStr = JSON.stringify(data);
            //计算请求参数签名
            signature = crypto.hmacSha256(dataStr, gd.ak)
        }
    } else {
        dataStr = JSON.stringify(data);
    }
    if (loading) {
        setTimeout(()=>{
            if(!end){
                wx.showLoading({
                    mask: true,
                    title: '请稍后',
                });
            }
        },1000)
    }
    //发起请求
    wx.request({
        url: config.server + api,
        method: "POST",
        data: dataStr,
        header: {
            'Content-Hmac': signature
        },
        dataType: "text",
        success: res => {
            if (res.statusCode !== 200) {
                wx.showToast({
                    title: '失败',
                    icon: 'none',
                    duration: 2000
                })
                typeof fail === "function" && fail(res);
            } else {
                const sig = res.header["Content-Hmac"];
                const jsonRes = JSON.parse(res.data);
                //校验签名
                if (sig) {
                    //校验签名
                    const flag = crypto.checkHmacSha256(res.data, sig, gd.ak);
                    if (flag) {
                        typeof success === "function" && success(jsonRes);
                    } else {
                        wx.showToast({
                            title: '签名校验失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                } else {
                    typeof success === "function" && success(jsonRes);
                }
            }
        },
        fail: res => {
            console.error(res);
            wx.showToast({
                title: '失败',
                icon: 'none',
                duration: 2000
            })
            typeof fail === "function" && fail(res);
        },
        complete: (res) => {
            if (loading) {
                wx.hideLoading();
            }
            end = true;
            typeof complete === "function" && complete(res);
        }
    })
}
module.exports = {
    ajax,
}
