const pageTitle = require('../../../assets/title.json.js');
const orderStorage = require("../../../storage/order");
const {pay} = require("../../../utils/pay");
const ajax = require('../../../utils/ajax').ajax;
const order_state = require('../../../assets/common').order_state;
Page({
    data: {
        activeTab: 0,
        order_list: [
            {
                id: 3,
                title: order_state[3],
            },
            {
                id: 1,
                title: order_state[1],
            },
            {
                id: 4,
                title: order_state[4],
            },
            {
                id: 2,
                title: order_state[2],
            },
            {
                id: 5,
                title: order_state[5],
            },
            {
                id: 6,
                title: order_state[6],
            },
        ],
    },
    onShow: function () {
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.mine.child.order);
        const id = options.id ? parseInt(options.id, 10) : this.data.order_list[0].id;
        //const id = 3;
        let index = this.idToIndex(id);
        if (index === 0) {
            this.loadData(id);
        } else {
            this.setData({
                activeTab: index
            })
        }
    },
    change(e) {
        const id = this.data.order_list[e.detail.index].id;
        this.loadData(id);
    },
    loadData(id) {
        let index = this.idToIndex(id);
        //查询订单
        ajax("/order/list", {
            data: {
                state: id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    const key = "order_list[" + index + "].child";
                    this.setData({
                        [key]: data.list
                    });
                    //更新数字
                    this.refreshCount(data.order);
                }
            }
        })
    },
    //详情
    clickDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/mine/order/detail/index?id=" + id
        })
    },
    refreshCount(order){
        orderStorage.set(order);
        for (let orderStateKey in order_state) {
            if (orderStateKey === "6") {
                continue
            }
            let id = parseInt(orderStateKey);
            let index = this.idToIndex(id);
            const key = "order_list[" + index + "].title";
            this.setData({
                [key]: order_state[id] + "(" + order[id] + ")"
            });
        }
    },
    //支付
    clickPayButton(e) {
        const id = e.currentTarget.dataset.id;
        //提交订单
        pay(id, () => {
            let dIndex = this.idToIndex(1);
            let index = 0;
            this.data.order_list[dIndex].child.some((v,i)=>{
                if (v.id === id){
                    index = i;
                    return true
                }
            });
            const key = "order_list[" + dIndex + "].child[" + index + "].id";
            this.setData({
                [key]: ""
            });
        })
    },
    //确认收货
    clickReceive(e){
        const id = e.currentTarget.dataset.id;
        ajax("/order/modify2", {
            data: {
                id: id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    let dIndex = this.idToIndex(3);
                    let index = 0;
                    this.data.order_list[dIndex].child.some((v,i)=>{
                        if (v.id === id){
                            index = i;
                            return true
                        }
                    });
                    const key = "order_list[" + dIndex + "].child[" + index + "].delete";
                    this.setData({
                        [key]: true
                    });
                }
            }
        })
    },
    idToIndex(id) {
        let index = 0;
        this.data.order_list.some((v, i) => {
            if (v.id === id) {
                index = i;
                return true;
            }
        });
        return index;
    },
    //物流
    navigatorToLogistics(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/mine/order/logistics/index?id=" + id
        })
    },
    //评价
    navigatorToComment(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/mine/order/comment/index?id=" + id
        })
    },
    //查看评价
    navigatorToShowComment(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/mine/order/comment_detail/index?id=" + id
        })
    },
    commented(id){
        //设置已评价状态
        const dIndex = this.idToIndex(4);
        let index = 0;
        this.data.order_list[dIndex].child.some((v,i)=>{
            if (v.id === id){
                index = i;
                return true
            }
        });
        const key = "order_list[" + dIndex + "].child[" + index + "].delete";
        this.setData({
            [key]: true
        });
    }
});
