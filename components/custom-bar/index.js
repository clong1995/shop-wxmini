Component({
    options: {
        multipleSlots: true
    },
    properties: {
        background: {type: String, value: "white"},
    },
    data: {},
    lifetimes: {
        attached: function () {
            let buttonBoundingClientRect = wx.getMenuButtonBoundingClientRect();
            let systemInfoSync = wx.getSystemInfoSync();
            let buttonBoundingClientMargin = systemInfoSync.windowWidth - buttonBoundingClientRect.left - buttonBoundingClientRect.width;
            this.setData({
                statusBarHeight: systemInfoSync.statusBarHeight,
                height: buttonBoundingClientRect.height + buttonBoundingClientRect.top * 2 - systemInfoSync.statusBarHeight + buttonBoundingClientMargin / 2,
                //width: buttonBoundingClientRect.left,
                paddingRight: buttonBoundingClientMargin + buttonBoundingClientRect.width,
                paddingLeft: buttonBoundingClientMargin,
                paddingBottom: buttonBoundingClientMargin / 2,
                leftWidth: buttonBoundingClientRect.width,
                leftHeight: buttonBoundingClientRect.height,
                centerHeight: buttonBoundingClientRect.height,
            })
        },
    },
    methods: {},
});
