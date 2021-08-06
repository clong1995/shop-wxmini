const ajax = require('./ajax').ajax;
const gd = getApp().globalData;
const add = (id,cb) => {
    //发起请求
    ajax("/shopping_cart/add", {
        loading: true,
        data: {
            id: id,
        },
        success: (res) => {
            if (res.state === "OK") {
                if (!res.data.has) {
                    //不存在
                    gd.cart.count+=1;
                }
                //清空首页购物车
                gd.cart.fresh = true;
                if(typeof cb === "function"){
                    cb();
                }
            }
        }
    })
}
const del = (id,cb) => {
    //发起请求
    ajax("/shopping_cart/remove", {
        loading: true,
        data: {
            id: id,
        },
        success: (res) => {
            if (res.state === "OK") {
                //变更首页数量
                gd.cart.count-=1;
                gd.cart.fresh = true;
                cb();
            }
        }
    })
}
const list = (cb)=>{
    ajax("/shopping_cart/list", {
        loading: true,
        success: (res) => {
            if (res.state === "OK") {
                cb(res.data.shoppingCart_list);
            }
        }
    })
}
const refresh = ()=>{
    if (gd.cart.count){
        wx.setTabBarBadge({
            index: 1,
            text: gd.cart.count.toString()
        })
    }else{
        wx.removeTabBarBadge({
            index: 1
        });
    }
}
module.exports = {
    add,
    del,
    list,
    refresh,
}
