const ajax = require('../../utils/ajax').ajax;
const authStorage = require('../../storage/auth');
Page({
    code: "",
    data: {
        phone: "请输入手机号"
    },
    onLoad: function (options) {
        wx.showLoading({
            mask: true,
            title: '请稍后',
        });
        const _this = this;
        wx.login({
            success(res) {
                if (res.code) {
                    _this.code = res.code;
                }
            },
            fail(res) {
                console.log(res);
                wx.showToast({
                    title: 'login error',
                    mask: true,
                    icon: 'error'
                })
            },
            complete() {
                wx.hideLoading();
            }
        });
    },
    onSendCodeClick() {
        const patrn = /^[0-9]*$/;
        if (this.data.phone.length !== 11 || !patrn.test(this.data.phone)) {
            wx.showToast({
                title: '手机号不正确',
                mask: true,
                icon: 'error'
            })
        }
    },
    getPhoneNumber(e) {
        //微信登入
        if (e.detail.errMsg !== "getPhoneNumber:ok") {
            console.log(e);
            wx.showToast({
                title: '登录失败',
                mask: true,
                icon: 'error'
            });
            return
        }

        wx.showLoading({
            mask: true,
            title: '请稍后',
        });
        ajax("/user/get1", {
            auth: false,
            data: {
                code: this.code,
                encrypted_data: e.detail.encryptedData,
                iv: e.detail.iv,
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    this.setData({
                        phone: data.phone
                    });
                    //保存到全局
                    const gd = getApp().globalData;
                    gd.token = data["token"]
                    gd.ak = data["access_key_id"]

                    //持久化
                    authStorage.setToken(gd.token)
                    authStorage.setAk(gd.ak)

                    //跳转
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    }
});
