const ajax = require('../../../utils/ajax').ajax;
const pageTitle = require('../../../assets/title.json.js');
Page({
    data: {},
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.product.child.comment);
        ajax("/comment/list", {
            data: {
                id: "ABAAK4HjiRM"//options.id
            },
            success: (res) => {
                if (res.state === "OK") {
                    this.setData(res.data);
                }
            }
        })
    }
});
