const pageTitle = require('../../../../assets/title.json.js');
const ajax = require('../../../../utils/ajax').ajax;
Page({
    id: "",
    data: {
        schedule:[],
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.mine.child.order.child.logistics);
        this.id = options.id;
        // this.id = "ABBAelcFvxM";
        ajax("/order/get4", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    this.setData(data);
                }
            }
        })
    },
    //确认收货
    clickReceive(){
        ajax("/order/modify2", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    this.setData({
                        state: 4
                    });
                }
            }
        })
    },
});
