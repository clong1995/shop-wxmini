const ajax = require('../../utils/ajax').ajax;
const pageTitle = require('../../assets/title.json.js');
const page = require("../../utils/page");
Page({
    order_id: "",
    data: {
        consignee_list: []
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.consignee);
        this.order_id = options.order_id;
        ajax("/consignee/list", {
            success: (res) => {
                if (res.state === "OK") {
                    res.data.consignee_list.forEach((v, i) => {
                        res.data.consignee_list[i]["last"] = v.name.charAt(v.name.length - 1)
                    })
                    this.setData({
                        consignee_list: res.data.consignee_list,
                    });
                }
            }
        })
    },
    clickEditAddress(e) {
        wx.navigateTo({
            url: "/pages/consignee/add/index?id=" + e.currentTarget.dataset.id
        })
    },
    clickAddAddress(e) {
        wx.navigateTo({
            url: "/pages/consignee/add/index?id="
        })
    },
    clickAddress(e) {
        if (this.order_id) {
            const id = e.currentTarget.dataset.id;
            const consignee = this.data.consignee_list.find(v => v.id === id);
            consignee.id = this.order_id;
            //修改订单地址
            ajax("/order/modify", {
                data: consignee,
                success: (res) => {
                    if (res.state === "OK") {
                        let prevPage = page.prev();
                        prevPage.setData({
                            consignee: consignee
                        });
                        wx.navigateBack();
                    }
                }
            })
        }
    },
});
