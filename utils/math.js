//保留n位小数
function round(value, n) {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

module.exports = {
    round
}
