const pageTitle = require('../../../assets/title.json');
const gd = getApp().globalData;
Page({
    onLoad: function () {
        pageTitle.setTitle(pageTitle.cart);
    },
    onShow: function () {
        if (gd.cart.fresh) {
            const cart = this.selectComponent('#cart');
            cart.loadData(count => {
                gd.cart.fresh = false;
                gd.cart.count = count;
            });
        }
    },
});
