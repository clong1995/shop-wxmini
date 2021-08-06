const ajax = require('../../utils/ajax').ajax;
const pageTitle = require('../../assets/title.json.js');
Page({
    data: {
        pageTitle: pageTitle.search.title,
        search_word: "",
        history_list: [],
        find_list: [],
    },
    onLoad: function (options) {
        const search_word = options.search_word;
        this.setData({
            search_word: search_word,
        });
        //获取我的页面的数据
        this.loadData()
    },
    loadData() {
        ajax("/mixture/search", {
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    this.setData({
                        history_list: data["history_list"],
                        find_list: data["find_list"],
                    });
                }
            }
        })
    },
    clickRemoveHistory() {
        ajax("/history/remove", {
            success: (res) => {
                if (res.state === "OK") {
                    this.setData({
                        history_list: []
                    });
                }
            }
        })
    },
    confirm(e) {
        const value = e.detail.value;
        if (!value) {
            return;
        }
        this.navigateToProductList(value);
    },
    clickSearchWord(e) {
        let value = e.currentTarget.dataset.value;
        /*this.setData({
            search_word: value,
        });*/
        this.navigateToProductList(value);
    },
    clickFind(e) {
        let value = e.currentTarget.dataset.value;
        wx.navigateTo({
            url: "/pages/search/product_list/index?keyword=" + value
        })
    },
    navigateToProductList(value) {
        //检查是否已经存在
        this.data.history_list.forEach((v, i) => {
            if (v === value) {
                this.data.history_list[i] = "";
            }
        });
        this.data.history_list.unshift(value);
        this.setData({
            history_list: this.data.history_list,
        });
        //记录搜索历史
        ajax("/history/add", {
            data: {
                keyword: value
            }
        })
        wx.navigateTo({
            url: "/pages/search/product_list/index?keyword=" + value
        })
    }
});
