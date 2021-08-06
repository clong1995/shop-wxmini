const pixelRatio = 750 / wx.getSystemInfoSync().windowWidth;
const rpxToPx = (rpx) => {
    return rpx / pixelRatio;
}
const pxToRpx = (px) => {
    return px * pixelRatio;
}
module.exports = {
    rpxToPx,pxToRpx
}
