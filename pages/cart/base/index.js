const check = require('../../../utils/check');
const cart = require("../../../utils/cart");
const gd = getApp().globalData;
Component({
    data: {
        list: [],
        slideButtons: [{
            type: 'warn',
            text: '删除',
            src: '/assets/icons/shanchu.svg', // icon的路径
        }],
    },
    properties: {
        refresh: {type: Boolean, value: true},
    },
    created() {
        if (!check.isLogin()) {
            //没有登入，去登入
            /*wx.redirectTo({
                url: "/pages/login/index"
            });*/
            wx.reLaunch({
                url: "/pages/login/index"
            })
        }
    },
    methods: {
        slideButtonTap(e) {
            //删除购物车
            const id = e.currentTarget.dataset.id;
            cart.del(id,()=>{
                this.data.list.some((v,i)=>{
                    if(v.id === id){
                        const key = "list["+i+"].id";
                        this.setData({
                            [key]: ""
                        });
                        return true;
                    }
                });
                if(this.properties.refresh){
                    cart.refresh()
                    gd.cart.fresh = false;
                }
            })
        },
        loadData(cb) {
            if (check.isLogin()) {//登录了
                cart.list((list)=>{
                    if(typeof cb === "function"){
                        cb(list.length);
                    }
                    if(this.properties.refresh){
                        cart.refresh()
                    }
                    this.setData({
                        list:list
                    })
                })
            }
        },
        navigateToProduct(e) {
            const id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: "/pages/product/index?id=" + id
            })
        },
        navigateToPurchase(e) {
            const id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: "/pages/product/index?id=" + id + "&prop=true"
            })
        }
    },
});
