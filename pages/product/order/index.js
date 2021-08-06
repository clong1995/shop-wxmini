const pageTitle = require('../../../assets/title.json.js');
const ajax = require('../../../utils/ajax').ajax;
const pay = require('../../../utils/pay').pay;
Page({
    p_id: "",
    o_id: "",
    prop: [],
    count: 0,
    data: {
        pageTitle: pageTitle.product.child.order.title,
        count: 0,
        consignee: {},
        product: {},
        total: 0
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.product.child.order);
        this.p_id = options.id;
        this.prop = options.prop ? options.prop.split(",") : [];
        this.count = parseInt(options.count);

        //TODO
        /*this.p_id = "ABAAK4HjiRM";
        this.prop = ["ABCAtJTRmRM", "ABBA1kHvmhM"];
        this.count = 1;*/

        //查询订单信息
        ajax("/order/get", {
            data: {
                id: this.p_id,
                prop: this.prop,
                count: this.count
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    this.o_id = data.id;
                    this.setData({
                        count: this.count,
                        consignee: data.consignee,
                        product: data.product,
                        total: this.count * data.product.price
                    });
                }
            }
        })
    },
    clickAddress() {
        const _this = this;
        wx.navigateTo({
            url: "/pages/consignee/index?order_id=" + _this.o_id
        })
    },
    clickSubmit() {
        //提交订单
        pay(this.o_id,()=>{
            wx.navigateBack();
        })
    }
});
