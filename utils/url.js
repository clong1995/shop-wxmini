const getQuery = url => {
    let json = {};
    let arr = url.substr(url.indexOf('?') + 1).split('&');
    arr.forEach(item => {
        let tmp = item.split('=');
        json[tmp[0]] = decodeURIComponent(tmp[1]);
    });
    return json;
}

module.exports = {
    getQuery
}