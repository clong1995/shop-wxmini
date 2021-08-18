const pageTitle = require('../../../../assets/title.json.js');
const ajax = require('../../../../utils/ajax').ajax;
Page({
    id: "",
    data: {
        name: "",
        phone: "",
        express_company: "",
        express_number: "",
        order_state: 0,
        logistic_state: 0,
        traces: [],
        receipt: ""
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.mine.child.order.child.logistics);
        this.id = options.id;
        // this.id = "ABCAuV-UwRM";
        ajax("/logistics/get", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    let receipt = "未签收";
                    if (data.traces.length > 0 && data.logistic_state === 3) {
                        let trace = data.traces[0];
                        let rt = trace["station"].match(/【(.*?)】/)[1];
                        if (rt) {
                            receipt = rt;
                        }
                    }
                    this.setData({
                        name: data.name,
                        phone: data.phone,
                        express_company: data.express_company,
                        express_number: data.express_number,
                        order_state: data.order_state,
                        logistic_state: data.logistic_state,
                        traces: data.traces,
                        receipt: receipt,
                    });
                }
            }
        })
    },
    //确认收货
    clickReceive() {
        ajax("/order/modify2", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    /*this.setData({
                        state: 4
                    });*/
                }
            }
        })
    },
});
