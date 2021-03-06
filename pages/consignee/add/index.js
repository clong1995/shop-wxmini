const ajax = require('../../../utils/ajax').ajax;
const pageTitle = require('../../../assets/title.json.js');
const page = require('../../../utils/page');
Page({
    id: "",
    data: {
        name: "",
        phone: "",
        region: ['', '', ''],
        address: "",
        checked: false
    },
    onLoad: function (options) {
        pageTitle.setTitle(pageTitle.consignee.child.add);
        if (options.id) {
            this.id = options.id
            ajax("/consignee/get", {
                data: {
                    id: this.id,
                },
                success: (res) => {
                    if (res.state === "OK") {
                        const data = res.data;
                        this.setData({
                            name: data.name,
                            phone: data.phone,
                            region: [data.province, data.city, data.town],
                            address: data.address,
                            checked: data.default
                        })
                    }
                }
            })
        }
    },
    pickerChange(e) {
        const value = e.detail.value;
        this.setData({
            region: value
        })
    },
    nameInput(e) {
        this.setData({
            name: e.detail.value
        })
    },
    phoneInput(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    addressInput(e) {
        this.setData({
            address: e.detail.value
        })
    },
    bindCheck(e) {
        this.setData({
            checked: e.detail.value
        })
    },
    clickSave() {
        let canSubmit = true;
        for (let dataKey in this.data) {
            if (dataKey === "region") {
                const found = this.data[dataKey].find(v => v === "");
                if (found) {
                    canSubmit = false;
                    break
                }
            }
            if (this.data[dataKey] === "") {
                canSubmit = false;
                break
            }
        }
        if (!canSubmit) {
            wx.showToast({
                title: '?????????',
                mask: true,
                icon: 'error'
            })
            return
        }
        const data = {
            id: this.id,
            name: this.data.name,
            phone: this.data.phone,
            province: this.data.region[0],
            city: this.data.region[1],
            town: this.data.region[2],
            address: this.data.address,
            default: this.data.checked
        };
        ajax("/consignee/update", {
            data: data,
            success: (res) => {
                if (res.state === "OK") {
                    let prevPage = page.prev();
                    let key = "";
                    //??????
                    if (this.id) {
                        //??????
                        let index = 0;
                        prevPage.data.consignee_list.some((v, i) => {
                            if (v.id === this.id) {
                                index = i;
                                return true;
                            }
                        });
                        key = "consignee_list[" + index + "]";
                    } else {
                        //??????
                        key = "consignee_list[" + prevPage.data.consignee_list.length + "]";
                        data.id = res.data.id;
                    }

                    if (data.default) {
                        //?????????
                        let index = 0;
                        let value = prevPage.data.consignee_list.find((v, i) => {
                            if (v["default"]) {
                                index = i;
                                return true;
                            }
                        });

                        const key = "consignee_list[" + index + "].default";
                        prevPage.setData({
                            [key]: false
                        });
                    }

                    prevPage.setData({
                        [key]: data
                    });

                    wx.navigateBack()
                }
            }
        })
    },
    clickDelete() {
        if (this.id) {
            ajax("/consignee/remove", {
                data: {
                    id: this.id,
                },
                success: (res) => {
                    if (res.state === "OK") {
                        let index = 0;
                        let prevPage = page.prev();
                        prevPage.data.consignee_list.some((v, i) => {
                            if (v.id === this.id) {
                                index = i;
                                return true;
                            }
                        });
                        let key = "consignee_list[" + index + "].id";
                        prevPage.setData({
                            [key]: ""
                        });
                        wx.navigateBack()
                    }
                }
            })
        } else {
            wx.navigateBack()
        }
    }
});
