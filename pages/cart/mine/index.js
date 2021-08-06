const pageTitle = require('../../../assets/title.json.js');
const gd = getApp().globalData;
Page({
    onLoad() {
        pageTitle.setTitle(pageTitle.cart);
        const cart = this.selectComponent('#cart');
        cart.loadData(count => {
            gd.cart.count = count;
        });
    },
});
