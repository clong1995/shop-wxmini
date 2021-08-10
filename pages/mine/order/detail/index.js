const pageTitle = require('../../../../assets/title.json.js');
const ajax = require('../../../../utils/ajax').ajax;
const order_state = require('../../../../assets/common').order_state;
const page = require('../../../../utils/page');
const orderStorage = require('../../../../storage/order');
Page({
    id: "",
    data: {
        count:0,
        price:0,
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.mine.child.order.child.detail);
        this.id = options.id;
        //this.id = "ABCAuV-UwRM";
        ajax("/order/get1", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    data["id"] = this.id;
                    data["state_title"] = order_state[data["state"]];
                    this.setData(data);
                }
            }
        })
    },
    navigateToSnapshoot() {
        wx.navigateTo({
            url: "/pages/mine/order/detail/snapshoot/index?id=" + this.id
        })
    },
    navigatorToLogistics() {
        wx.navigateTo({
            url: "/pages/mine/order/logistics/index?id=" + this.id
        })
    },
    clickRemove() {
        ajax("/order/remove", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    //修改上一页数据
                    let prevPage = page.prev();
                    let pIndex = 0;
                    prevPage.data.order_list.some((v, i) => {
                        if (v.id === this.data.state) {
                            pIndex = i;
                            return true
                        }
                    });
                    let cIndex = 0;
                    prevPage.data.order_list[pIndex].child.some((v, i) => {
                        if (v.id === this.id) {
                            cIndex = i;
                            return true
                        }
                    })
                    const key = "order_list[" + pIndex + "].child[" + cIndex + "].id";
                    prevPage.setData({
                        [key]: ""
                    });

                    //修改订单数据
                    let order = orderStorage.get();
                    order[1] -= 1;
                    orderStorage.set(order);

                    wx.navigateBack();
                }
            }
        })
    }
});
