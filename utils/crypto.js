import CryptoJS from 'crypto-js';

function checkHmacSha256(message, messageMAC, key) {
    return messageMAC === hmacSha256(message,key);
}

function hmacSha256(message,key) {
    return CryptoJS.HmacSHA256(message, key).toString();
}

module.exports = {
    checkHmacSha256,
    hmacSha256,
}