const gd = getApp().globalData;

const isEmpty = date => {
    switch (date) {
        case false:
            return true;
        case 0:
            return true;
        case "":
            return true;
        case null:
            return true;
        case undefined:
            return true;
    }
}

const isNotEmpty = date => {
    return !isEmpty(date);
}

const isLogin = () => {
    return gd.token && gd.ak;
}



module.exports = {
    isEmpty,
    isNotEmpty,
    isLogin
}
