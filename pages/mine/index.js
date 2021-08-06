const ajax = require('../../utils/ajax').ajax;
const orderStorage = require('../../storage/order');
const pageTitle = require('../../assets/title.json.js');
const order_state = require('../../assets/common').order_state;
const gd = getApp().globalData;
Page({
    data: {
        pageTitle: pageTitle.mine.title,
        user: {
            avatar: "/assets/images/avatar.png",
            nickname: "",
            phone: "",
        },
        order: [
            {
                id: "gwc",
                "title": "购物车",
                "page": "/pages/cart/mine/index",
                "icon": "icon-gouwuche",
                "count": gd.cart.count,
            },
            {
                id: 3,
                "title": order_state[3],
                "icon": "icon-ccgl-yundanguanli-1",
                "count": 0,
            },
            {
                id: 4,
                "title": order_state[4],
                "icon": "icon-daipingjia",
                "count": 0,
            },
            {
                id: 1,
                "title": order_state[1],
                "icon": "icon-daifukuan",
                "count": 0,
            },
        ],
        func: [
            {
                "title": "消息",
                "page": "use app",
                "icon": "icon-weibiaoti--",
                "count": 0,
            }, {
                "title": "收件地址",
                "page": "/pages/consignee/index",
                "icon": "icon-weizhi1",
                "count": 0,
            },
        ],
    },
    onShow: function () {
        let order = orderStorage.get();
        this.setData({
            //购物车
            "order[0].count": gd.cart.count,
            //待收货
            "order[1].count": order[3],
            //待评价
            "order[2].count": order[4],
            //未付款
            "order[3].count": order[1],
        });
    },
    onLoad: function () {
        pageTitle.setTitle(pageTitle.mine);
        //获取我的页面的数据
        this.loadData();
    },
    getUserProfile(e) {
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
                this.setData({
                    "user.avatar": res.userInfo.avatarUrl,
                    "user.nickname": res.userInfo.nickName,
                });
                //保存到数据库
                ajax("/user/modify", {
                    data: {
                        nickname: res.userInfo.nickName,
                        avatar: res.userInfo.avatarUrl,
                    }
                })
            }
        })
    },
    loadData(auth = true) {
        ajax("/mixture/mine", {
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    const info = data["info"]
                    if (!info.avatar) {
                        info.avatar = "/assets/images/avatar.png";
                    }
                    this.setData({
                        user: info,
                        //待收货
                        "order[1].count": data["order"][3],
                        //待评价
                        "order[2].count": data["order"][4],
                        //未付款
                        "order[3].count": data["order"][1],
                        //消息
                        "func[0].count": data["message"],
                    });
                    orderStorage.set(data["order"]);
                }
            }
        })
    },
    navigateToOrder(e) {
        const index = e.currentTarget.dataset.index;
        let url = "/pages/mine/order/index";
        if (index !== undefined) {
            const id = this.data.order[index].id;
            let query = "";
            if (id !== undefined) {
                query = "?id=" + id;
                url = "/pages/mine/order/index" + query
            } else {
                //购物车
                url = "/pages/cart/mine/index"
            }
        }
        wx.navigateTo({
            url: url
        })
    },
    navigateToFunc(e) {
        const index = e.currentTarget.dataset.index;
        const page = this.data.func[index].page;
        if (page === "use app") {
            wx.showModal({
                content: '请下载 [礼物吧] 手机APP',
                showCancel: false
            })
            return
        }
        wx.navigateTo({
            url: page
        })
    },
});
