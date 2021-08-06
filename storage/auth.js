const token = "token";
const ak = "ak";

const setToken = (data) => {
    wx.setStorageSync(token, data)
}
const setAk = (data) => {
    wx.setStorageSync(ak, data)
}

const getToken = () => {
    let value = wx.getStorageSync(token);
    if (!value) {
        return null;
    }
    return value
}
const getAk = () => {
    let value = wx.getStorageSync(ak);
    if (!value) {
        return null;
    }
    return value
}


module.exports = {
    setToken,
    setAk,
    getToken,
    getAk,
}
