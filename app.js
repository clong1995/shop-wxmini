// app.js
const navigate = require('storage/navigate');
const auth = require('storage/auth');
App({
    onLaunch() {
        navigate.del();
        this.globalData.token = auth.getToken()
        this.globalData.ak = auth.getAk()
    },
    globalData: {
        token: null,
        ak: null,
        cart:{
            count:0,
            fresh:true,
        }
    }
})
