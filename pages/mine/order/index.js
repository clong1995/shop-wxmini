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
        this.refreshCount();
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.mine.child.order);
        const id = parseInt(options.id, 10);
        // const id = 1;
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
        const index = e.detail.index;
        const id = this.data.order_list[index].id;
        this.loadData(id);
    },
    loadData(id) {
        let index = this.idToIndex(id);
        const found = this.data.order_list[index];
        if (found && !found.child) {
            //订单类型
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
                            [key]: data.order_list
                        });
                    }
                }
            })
        }
    },
    clickDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/mine/order/detail/index?id=" + id
        })
    },
    titleCount(id,count){
        let index = this.idToIndex(id);
        return this.data.order_list[index].title.split("(")[0]+"("+count+")"
    },
    refreshCount(){
        let order = orderStorage.get();
        this.setData({
            //待收货
            "order_list[0].title": this.titleCount(3,order[3]),
            //未付款
            "order_list[1].title": this.titleCount(1,order[1]),
            //待评价
            "order_list[2].title": this.titleCount(4,order[4]),
            //待发货
            "order_list[3].title": this.titleCount(2,order[2]),
            //售后退款
            "order_list[4].title": this.titleCount(5,order[5]),
        });
    },
    clickPayButton(e) {
        const id = e.currentTarget.dataset.id;
        //提交订单
        pay(id,()=>{
            //修改订单数据
            let order = orderStorage.get();
            order[1] -= 1;
            order[2] += 1;
            orderStorage.set(order);
            this.refreshCount();
            //更改视图
            //待发货
            let pIndex = this.idToIndex(2);

            //已付款的订单
            let index = 0;
            const found = this.data.order_list[1].child.find((v,i)=>{
                if (v.id === id){
                    index = i;
                    return true
                }
            });
            //移动列表
            if(!this.data.order_list[pIndex].child){
                //空的，加载数据
                this.loadData(2);
            }else{
                //移动过去
                this.data.order_list[pIndex].child.unshift(found);
                const key = "order_list["+pIndex+"].child";
                this.setData({
                    [key]:this.data.order_list[pIndex].child
                })
            }

            //删除
            //未支付
            let dIndex = this.idToIndex(1);
            const key = "order_list["+dIndex+"].child[" + index + "].id";
            this.setData({
                [key]: ""
            });
        })
    },
    idToIndex(id){
        let index = 0;
        this.data.order_list.some((v, i) => {
            if (v.id === id) {
                index = i;
                return true;
            }
        });
        return index;
    }
});
