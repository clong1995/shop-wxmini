const pageTitle = require('../../../../assets/title.json.js');
const ajax = require('../../../../utils/ajax').ajax;
Page({
    id: "",
    data: {
        image_list: [],
        grade: 0,
        content: "",
        create_date:""
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.comment);
        this.id = options.id;
        // this.id = "ABAA9ioPvxM";
        ajax("/comment/get", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    this.setData(data);
                }
            }
        })
    },
});
