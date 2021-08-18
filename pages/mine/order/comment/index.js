const pageTitle = require('../../../../assets/title.json.js');
const ajax = require('../../../../utils/ajax').ajax;
const page = require('../../../../utils/page');
const str = require('../../../../utils/string');
Page({
    id: "",
    data: {
        max: 5,
        images: [],
        grade: 1,
        phrase: [],
        content: "",
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.mine.child.order.child.comment);
        this.id = options.id;
        // this.id = "ABDANI_8vhM";
        ajax("/comment/list1", {
            data: {
                id: this.id,
            },
            success: (res) => {
                if (res.state === "OK") {
                    const data = res.data;
                    this.setData({
                        phrase: data["phrase_list"]
                    });
                }
            }
        })
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
                [key]: res
            });
        });
    },
    clickDelete(e) {
        const index = e.currentTarget.dataset.index;
        this.data.images.splice(index, 1);
        this.setData({
            images: this.data.images
        })
    },
    contentInput(e) {
        this.setData({
            content: e.detail.value
        })
    },
    clickPhrase(e) {
        const index = e.currentTarget.dataset.index;
        const value = this.data.phrase[index];
        this.setData({
            content: str.trim(this.data.content + "," + value, ",")
        })
    },
    clickSubmit() {
        if (!this.data.content) {
            wx.showToast({
                title: '请完填写评价内容',
                mask: true,
                icon: 'error'
            })
            return;
        }
        const dImage = this.data.images.map(v => v.split("/").pop());
        ajax("/comment/add", {
            data: {
                id: this.id,
                image: dImage.join(","),
                grade: this.data.grade,
                content: this.data.content
            },
            success: (res) => {
                if (res.state === "OK") {
                    //修改订单页的未评价状态
                    page.getPage("mine/order").commented(this.id);
                    //返回
                    wx.navigateBack({
                        delta: 1
                    });
                }
            }
        })
    }
});
