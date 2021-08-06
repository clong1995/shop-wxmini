const key = "navigate";
const set = (data) => {
    wx.setStorageSync(key, data)
}
const get = () => {
    let value = wx.getStorageSync(key)
    if (!value) {
        return null;
    }
    return value
}
const del = () => {
    wx.removeStorageSync(key);
}
module.exports = {
    set,
    get,
    del
}
