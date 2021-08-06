module.exports = {
    index: {
        page: "",
        title: {
            t1: "礼物分类",
            t2: "新晋好物"
        }
    },
    product: {
        page: "",
        title: {
            t1: "礼物评价",
            t2: "图文详情",
            t3: "礼物推荐",
            t4: "商品属性",
            t5: "券后",
        },
        child: {
            comment: {
                page: "评价",
            },
            order: {
                page: "确认订单",
                title: {
                    t1: "订单备注",
                    t2: "支付"
                }
            },
        }
    },
    mine: {
        page: "我的",
        title: {
            t1: "我的订单",
            t2: "常用功能",
            t3: "礼物吧",
            t4: "开源微信 小程序、手机app 商城",
        },
        child: {
            order: {
                page: "我的订单",
                child: {
                    detail: {
                        page: "订单详情",
                        child: {
                            snapshoot: {
                                page: "订单快照",
                                title: {
                                    t1: "图文详情",
                                    t2: "券后",
                                    t3: "成交单价",
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    classify: {
        page: "分类"
    },
    search: {
        page: "",
        title: {
            t1: "历史记录",
            t2: "发现",
        }
    },
    cart: {
        page: "购物车",
    },
    consignee: {
        page: "收件地址",
        child: {
            add: {
                page: "添加收件地址"
            }
        }
    },
    setTitle(title) {
        wx.setNavigationBarTitle({
            title: title.page
        });
    }
}
