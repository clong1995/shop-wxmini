const key = "order";
const set = (data) => {
    wx.setStorageSync(key, JSON.stringify(data));
}
const get = () => {
    let value = wx.getStorageSync(key);
    if (!value) {
        return null;
    }
    return JSON.parse(value);
}
module.exports = {
    set,
    get
}
