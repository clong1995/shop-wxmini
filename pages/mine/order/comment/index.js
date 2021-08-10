const pageTitle = require('../../../../assets/title.json.js');
const ajax = require('../../../../utils/ajax').ajax;
Page({
    id: "",
    data: {
        max: 5,
        images: [],
        grade: 1,
        phrase: ["五福周到", "好吃", "包装好", "分量足", "物流亏", "无指导书", "树梢呢"],
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.mine.child.order.child.comment);
        this.id = options.id;
        // this.id = "ABBAelcFvxM";
        /*ajax("/order/get4", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    this.setData(data);
                }
            }
        })*/
    },
    clickGrade(e) {
        const grade = e.currentTarget.dataset.grade;
        this.setData({
            grade: grade
        })
    },
    chooseImage() {
        let length = this.data.images.length;
        if (length >= this.data.max) {
            return;
        }
        const uploadImage = this.selectComponent('#uploadImage');
        uploadImage.upload(375, 667, res => {
            const key = "images[" + length + "]";
            this.setData({
                [key]: res.tempFilePath
            })
        });
    },
    clickDelete(e) {
        const index = e.currentTarget.dataset.index;
        this.data.images.splice(index, 1);
        this.setData({
            images: this.data.images
        })
    }
});
