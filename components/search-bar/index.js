const check = require('../../utils/check');
Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true,
    },
    properties: {
        hint: String,
        page: String,
        icon: String,
        color: {type: String, value: "var(--black45)"},
    },
    observers: {
        "page": function (sp) {
            check.isEmpty(sp) && console.error("page不得为空");
        }
    },
    data: {},
    methods: {
        navigatorTo() {
            if (this.properties.page) {
                wx.navigateTo({
                    url: this.properties.page
                })
            } else {
                this.triggerEvent('onclick')
            }
        }
    },
    lifetimes: {
        /*attached() {
            check.isEmpty(this.properties.page) && console.error("page不得为空");
        },*/
    },
});
