// index.js
// 获取应用实例
const ajax = require('../../utils/ajax').ajax;
const navigate = require('../../utils/navigate');
const check = require('../../utils/check');
const cart = require('../../utils/cart');
const pageTitle = require('../../assets/title.json.js');
const gd = getApp().globalData;
Page({
    data: {
        pageTitle: pageTitle.index.title,
        avatar: "",
        nickname: "",
        search_word: "",
        banner_list: [],
        classify_list: [],
        product_list: [],
        autoplay: true,
    },
    onShow: function () {
        this.setData({
            autoplay: true
        });
        this.initCartBadge();
    },
    onHide: function () {
        this.setData({
            autoplay: false
        })
    },
    onLoad() {
        //有登入
        if (check.isLogin()) {
            //没有等待跳转的页面，加载用户数据
            this.loadData(true, () => {//加载用户数据
                //等待跳转的页面
                const navigateTo = navigate.loginToGet();
                //还有等待跳转的页面
                if (navigateTo) {
                    //删除等待跳转的页面
                    navigate.loginToRemove()
                    wx.navigateTo({
                        url: navigateTo
                    });
                }
            });
        } else {
            //没有登入
            //加载默认数据
            this.loadData(false);
        }
    },
    navigateToWebview(e) {
        const index = e.currentTarget.dataset.index;
        navigate.loginTo("/pages/webview/index?url=" + this.data.banner_list[index]["link"]);
    },
    navigateToClassify(e) {
        const id = e.currentTarget.dataset.id;
        navigate.loginTo("/pages/classify/index?id=" + id);
    },
    navigateToProduct(e) {
        const id = e.currentTarget.dataset.id;
        navigate.loginTo("/pages/product/index?id=" + id);
    },
    navigateToMine() {
        navigate.loginTo("/pages/mine/index");
    },
    navigateToSearch() {
        navigate.loginTo("/pages/search/index?search_word=" + this.data.search_word);
    },
    loadData(auth = true, cb) {
        ajax(auth ? "/mixture/home" : "/mixture/home_no_auth", {
            auth: auth,
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    if (auth) {
                        this.setData({
                            search_word: data.search_word,
                            banner_list: data.banner_list,
                            classify_list: data.classify_list,
                            product_list: data["product_list"],
                            avatar: data.avatar,
                            nickname: data.nickname,
                        });
                        //设置购物车数量
                        gd.cart.count = data.shopping_cart;
                        this.initCartBadge();
                    } else {
                        this.setData({
                            search_word: data.search_word,
                            banner_list: data.banner_list,
                            classify_list: data.classify_list,
                            product_list: data["product_list"],
                        });
                    }
                    typeof cb === 'function' ? cb() : null;
                }
            }
        })
    },
    initCartBadge() {
        cart.refresh();
    },
})
