const ajax = require('../../utils/ajax').ajax;
const cart = require('../../utils/cart');
const pageTitle = require('../../assets/title.json');
Page({
    id: "",
    data: {
        pageTitle: pageTitle.product.title,
        count: 1,
        show: false,
        id: "",
        title: "",
        cover: "",
        price: 0,
        sale: 0,
        banner_list: [],
        comment_list: [],
        detail_list: [],
        recommend_list: [],
        total: 0,
        selected: "",
        prop_list: [],
        in_cart: false,
    },
    onLoad: function (options) {
        this.id = options.id;
        // this.id = "ABAAK4HjiRM";
        const prop = options.prop === "true";
        ajax("/mixture/product", {
            data: {
                id: this.id
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    //属性默认选中第一个
                    data.prop_list.forEach((_, i) => {
                        if (data.prop_list[i]["item_list"].length) {
                            data.prop_list[i]["item_list"][0]["selected"] = true
                        }
                    })
                    this.setData({
                        show: prop,
                        title: data.title,
                        cover: data.cover,
                        price: data.price,
                        sale: data.sale,
                        banner_list: data.banner_list,
                        comment_list: data.comment_list,
                        detail_list: data.detail_list,
                        recommend_list: data.recommend_list,
                        prop_list: data.prop_list
                    });
                    this.total();
                }
            }
        })
    },
    clickAddCart() {
        cart.add(this.id, () => {
            this.setData({
                in_cart: true
            })
        });
    },
    open: function () {
        if (this.data.prop_list.length > 0) {
            //展示属性
            this.setData({
                show: true
            })
        } else {
            //直接到确认订单
            this.submit();
        }
    },
    navigateToProduct(e) {
        const id = e.currentTarget.dataset.id;
        const product = this.data.recommend_list.find(v => v.id === id);
        wx.navigateTo({
            url: "/pages/product/index?id=" + id
        })
    },
    navigateToComment() {
        wx.navigateTo({
            url: "/pages/product/comment/index?id=" + this.id
        })
    },
    clickPlusCount() {
        this.setData({
            count: this.data.count + 1
        })
    },
    clickMinusCount() {
        if (this.data.count === 1) {
            return;
        }
        this.setData({
            count: this.data.count - 1
        })
    },
    clickProp(e) {
        const id = e.currentTarget.dataset.id;
        let pIndex = 0;
        let cIndex = 0;
        this.data.prop_list.some((v, i) => {
            const found = v.item_list.find((v1, i1) => {
                if (v1.id === id) {
                    cIndex = i1;
                    return true
                }
            });
            if (found) {
                pIndex = i;
                //设置其他不选,选择当前
                let prevSelected = 0;
                this.data.prop_list[pIndex].item_list.some((v2, i2) => {
                    if (v2.selected) {
                        prevSelected = i2;
                        return true;
                    }
                })
                const prevSelectedKey = "prop_list[" + pIndex + "].item_list[" + prevSelected + "].selected";
                const currSelectedKey = "prop_list[" + pIndex + "].item_list[" + cIndex + "].selected";
                if (prevSelectedKey !== currSelectedKey) {
                    this.setData({
                        [prevSelectedKey]: false,
                        [currSelectedKey]: true,
                    });
                    this.total();
                }
                return true;
            }
        });
    },
    total() {
        let selected = [];
        let total = this.data.price;
        this.data.prop_list.forEach(v => {
            v.item_list.some(v1 => {
                if (v1.selected) {
                    total += v1.price;
                    selected.push(v1.title);
                    return true;
                }
            })
        });

        this.setData({
            total: total,
            selected: selected.join(" / "),
        })
    },
    submit() {
        const prop = [];
        const count = this.data.count;
        this.data.prop_list.forEach(v => {
            v.item_list.some(v1 => {
                if (v1.selected) {
                    prop.push(v1.id);
                    return true;
                }
            })
        });
        this.setData({
            show: false
        })
        wx.navigateTo({
            url: "/pages/product/order/index?id=" + this.id + "&count=" + count + "&prop=" + prop.join(",")
        })
    },
    clickTalk() {
        wx.showModal({
            content: '请下载 [礼物吧] 手机APP',
            showCancel: false
        })
    }
});
