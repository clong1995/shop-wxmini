const ajax = require('../../../utils/ajax').ajax;
Page({
    data: {
        product_list: [],
    },
    onLoad: function (options) {
        const keyword = options.keyword;
        //const keyword = "沐浴液";
        wx.setNavigationBarTitle({
            title: keyword//页面标题为路由参数
        })
        //NLP拆词
        //获取我的页面的数据
        this.loadData(keyword)
    },
    loadData(keyword) {
        //查询搜索结果
        ajax("/product/list1", {
            data: {
                "keyword": keyword
            },
            success: (res) => {
                if (res.state === "OK") {
                    const product_list = res.data.product_list;
                    this.setData({
                        product_list: product_list,
                    });
                }
            }
        })
    },
    navigateToProduct(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/product/index?id=" + id
        })
    }
});
