const ajax = require('../../../../../utils/ajax').ajax;
const pageTitle = require('../../../../../assets/title.json');
Page({
    id: "",
    data: {
        pageTitle: pageTitle.mine.child.order.child.detail.child.snapshoot.title,
        show: false,
        title: "",
        price: 0,
        sale: 0,
        count: 1,
        total: 0,
        selected: "",
        banner_list: [],
        detail_list: [],
        prop_list: []
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.mine.child.order.child.detail.child.snapshoot);
        this.id = options.id;
        //this.id = "ABBAelcFvxM";
        ajax("/order/get2", {
            data: {
                id: this.id
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    let total = data.price;
                    let selected = "";
                    data.prop_list.forEach(v => {
                        v.item_list.forEach(v1 => {
                            if (v1.selected) {
                                total += v1.price;
                                selected += v.group_title + ":" + v1.title + ";";
                            }
                        })
                    })
                    this.setData({
                        title: data.title,
                        price: data.price,
                        sale: data.sale,
                        count: data.count,
                        total: total,
                        selected: selected,
                        banner_list: data.banner_list,
                        detail_list: data.detail_list,
                        prop_list: data.prop_list
                    });
                }
            }
        })
    },
    open: function () {
        if (this.data.prop_list.length > 0) {
            //展示属性
            this.setData({
                show: true
            })
        }
    }
});
