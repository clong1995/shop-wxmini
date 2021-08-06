const ajax = require('../../utils/ajax').ajax;
const pageTitle = require('../../assets/title.json.js');
Page({
    data: {
        classify_list: [],
        activeTab: 0,
    },
    pIndex: 0,
    cIndex: 0,
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.classify);
        const id = options.id;
        // const id = "ABDAsyoOkxM";
        ajax("/classify/list", {
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    if (id) {//选定的id存在
                        //设置选选中
                        data.classify_list.find((v, i) => {
                            if (v["id"] === id) {
                                this.pIndex = i;
                                return true
                            }
                        })
                    }
                    this.setData({
                        activeTab: this.pIndex,
                        classify_list: data.classify_list
                    });
                    this.loadFirstProduct();
                }
            }
        });
    },
    change(e) {
        this.pIndex = e.detail.index;
        this.cIndex = 0;
        const child = this.data.classify_list[this.pIndex].child[this.cIndex];
        if (!child) {
            return;
        }
        const id = child.id;
        if (id && !child.child) {
            this.loadProduct(id);
        }
    },
    changeChild(e) {
        this.cIndex = e.detail.index
        const child = this.data.classify_list[this.pIndex].child[this.cIndex];
        if (!child) {
            return;
        }
        const id = child.id;
        if (id && !child.child) {
            this.loadProduct(id);
        }
    },
    loadFirstProduct() {
        this.cIndex = 0;
        const child = this.data.classify_list[this.pIndex].child[this.cIndex];
        if (!child) {
            return;
        }
        const id = child.id;
        if (id && !child.child) {
            this.loadProduct(id);
        }
    },
    loadProduct(id) {
        ajax("/product/list", {
            data: {
                id: id
            },
            success: (res) => {
                if (res.state === "OK") {
                    const product_list = res.data.product_list;
                    if (product_list.length === 0) {
                        return
                    }
                    const key = "classify_list[" + this.pIndex + "].child[" + this.cIndex + "].child";
                    this.setData({
                        [key]: res.data.product_list
                    })
                }
            }
        });
    },
    navigateToProduct(e) {
        const id = e.currentTarget.dataset.id;
        const fond = this.data.classify_list[this.pIndex].child[this.cIndex].child.find(v => v.id === id);
        wx.navigateTo({
            url: "/pages/product/index?id=" + id
        })
    }
});
