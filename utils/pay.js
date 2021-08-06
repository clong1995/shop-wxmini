const {ajax} = require("ajax");
const pay = (order,cb) => {
    wx.checkSession({
        success() {
            //后台下单
            ajax("/order/get3", {
                data: {
                    id: order
                },
                success: (res) => {
                    if (res.state === "OK") {
                        const data = res.data;
                        //微信支付
                        wx.requestPayment({
                            'timeStamp': data["time_stamp"],
                            'nonceStr': data["nonce_str"],
                            'package': data["package_str"],
                            'signType': 'MD5',
                            'paySign': data["pay_sign"],
                            'success': function () {
                                cb();
                            },
                            'fail': function (res) {
                                console.error(res);
                                wx.showModal({
                                    content: '支付失败',
                                    showCancel:false
                                })
                            },
                        });
                    }
                },
                fail:(res)=>{
                    console.error(res);
                    wx.showModal({
                        content: '支付失败',
                        showCancel:false
                    })
                }
            })
        },
        fail() {
            //TODO 这里会因为长时间没有登录失败，在首页打开的时候就检查下

            console.log("checkSession fail");
        }
    });
}
module.exports = {
    pay
}
