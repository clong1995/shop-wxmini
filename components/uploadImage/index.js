const ajax = require('../../utils/ajax').ajax;
const url = require('../../utils/url');
const {loginTo} = require("../../utils/navigate");
Component({
    methods: {
        upload(maxWidth = 0, maxHeight = 0, success, fail, complete) {
            if (typeof success == "function") {
                const _this = this;
                wx.chooseImage({
                    count: 1,
                    sizeType: ['original'],
                    sourceType: ['album', 'camera'],
                    success(chooseImage) {
                        console.log("chooseImage success");
                        let ratio = 0;
                        const size = chooseImage.tempFiles[0].size;
                        const quality = (size / Math.pow(1000, 2)) > 1 ? (1 / size) : 1;
                        wx.getImageInfo({
                            src: chooseImage.tempFilePaths[0],
                            success(imageInfo) {
                                console.log("imageInfo success");
                                ratio = imageInfo.width / imageInfo.height;
                                const path = imageInfo.path;
                                if (maxWidth && maxHeight && (imageInfo.width > maxWidth || imageInfo.height > maxHeight)) {
                                    //压缩
                                    let targetWidth = 0,
                                        targetHeight = 0;
                                    // 等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
                                    if (ratio > maxWidth / maxHeight) {
                                        // 要求宽度*( 原生图片比例 )=新图片尺寸
                                        targetWidth = maxWidth;
                                        targetHeight = Math.round(maxWidth / ratio);
                                    } else {
                                        targetHeight = maxHeight;
                                        targetWidth = Math.round(maxHeight * ratio);
                                    }

                                    _this.setData({
                                        cw: targetWidth,
                                        ch: targetHeight
                                    });
                                    const ctx = wx.createCanvasContext('imageCanvas', _this);

                                    ctx.clearRect(0, 0, targetWidth, targetHeight);

                                    ctx.drawImage(path, 0, 0, targetWidth, targetHeight);

                                    wx.getSystemInfo({
                                        success(systemInfo) {
                                            if (systemInfo.platform !== "devtools") {
                                                ctx.draw(); //模拟器打开不会执行了，真机必须打开，不然绘制有问题。
                                            }
                                            ctx.draw(true, () => {
                                                wx.canvasToTempFilePath({
                                                    width: targetWidth,
                                                    height: targetHeight,
                                                    destWidth: targetWidth,
                                                    destHeight: targetHeight,
                                                    fileType: "jpg",
                                                    canvasId: 'imageCanvas',
                                                    quality: quality,
                                                    success: (canvasToTempFilePath) => {
                                                        console.log("canvasToTempFilePath success");
                                                        //console.log(canvasToTempFilePath);
                                                        /*wx.getImageInfo({
                                                            src: canvasToTempFilePath.tempFilePath,
                                                            success(ciInfo) {
                                                                console.log(ciInfo.width);
                                                                console.log(ciInfo.height);

                                                            }
                                                        })*/

                                                        _this.putOss(canvasToTempFilePath.tempFilePath, targetWidth + "_" + targetHeight,
                                                            putOss => {
                                                                success(putOss);
                                                            },
                                                            (putOss) => {
                                                                console.error("putOss fail");
                                                                console.error(putOss);
                                                                if (typeof fail == "function") {
                                                                    fail(putOss);
                                                                }
                                                            },
                                                            (putOss) => {
                                                                console.log("putOss complete");
                                                                if (typeof complete == "function") {
                                                                    complete(putOss);
                                                                }
                                                            });

                                                    },
                                                    fail(canvasToTempFilePath) {
                                                        console.error("draw fail");
                                                        console.error(canvasToTempFilePath);
                                                        if (typeof fail == "function") {
                                                            fail(canvasToTempFilePath);
                                                        }
                                                    },
                                                    complete(canvasToTempFilePath) {
                                                        console.log("draw complete");
                                                        if (typeof complete == "function") {
                                                            complete(canvasToTempFilePath);
                                                        }
                                                    }
                                                }, _this)
                                            });
                                        },
                                        fail(systemInfo) {
                                            console.error("getSystemInfo fail");
                                            console.error(systemInfo);
                                            if (typeof fail == "function") {
                                                fail(systemInfo);
                                            }
                                        },
                                        complete(systemInfo) {
                                            console.log("getSystemInfo complete");
                                            if (typeof complete == "function") {
                                                complete(systemInfo);
                                            }
                                        }
                                    })
                                } else {
                                    //不用压缩
                                    // 压缩成功，上传
                                    _this.putOss(path, imageInfo.width + "_" + imageInfo.height,
                                        putOss => {
                                            success(putOss);
                                        },
                                        (putOss) => {
                                            console.error("putOss fail");
                                            console.error(putOss);
                                            if (typeof fail == "function") {
                                                fail(putOss);
                                            }
                                        },
                                        (putOss) => {
                                            console.log("putOss complete");
                                            if (typeof complete == "function") {
                                                complete(putOss);
                                            }
                                        });
                                }
                            },
                            fail(imageInfo) {
                                console.error("imageInfo fail");
                                console.error(imageInfo);
                                if (typeof fail == "function") {
                                    fail(imageInfo);
                                }
                            },
                            complete(imageInfo) {
                                console.log("imageInfo complete");
                                if (typeof complete == "function") {
                                    complete(imageInfo);
                                }
                            }
                        })

                    },
                    fail(chooseImage) {
                        console.error("chooseImage fail");
                        console.error(chooseImage);
                        if (typeof fail == "function") {
                            fail(chooseImage);
                        }
                    },
                    complete(chooseImage) {
                        console.log("chooseImage complete");
                        if (typeof complete == "function") {
                            complete(chooseImage);
                        }
                    }
                })
            }
        },
        putOss(tempFilePath, ratio, success, fail, complete) {
            //请求上传地址
            ajax("/image/get", {
                data: {
                    ratio: ratio,
                    ext: tempFilePath.split(".")[1]
                },
                success: (ajaxRes) => {
                    if (ajaxRes.state === "OK") {
                        const data = ajaxRes.data;
                        const upload_url = data["upload_url"];
                        //上传文件
                        let uploadTask = wx.uploadFile({
                            url: upload_url["url"],
                            filePath: tempFilePath,
                            name: 'file', // 必须填file。
                            formData: {
                                key: upload_url["key"],//设置文件上传至OSS后的文件路径。例如需要将myphoto.jpg上传至test文件夹下，此处填写test/myphoto.jpg
                                policy: upload_url["policy"],
                                OSSAccessKeyId: upload_url["OSSAccessKeyId"],
                                signature: upload_url["signature"],
                            },
                            success: (uploadTaskRes) => {
                                if (uploadTaskRes.statusCode === 204) {
                                    console.log('上传成功');
                                    //查询下载地址
                                    if (typeof success == "function") {
                                        success(data["download_url"]);
                                    }
                                } else {
                                    console.error("uploadTask code != 204");
                                    console.error(uploadTaskRes);
                                    if (typeof fail == "function") {
                                        fail(uploadTaskRes);
                                    }
                                }
                            },
                            fail: uploadTaskRes => {
                                console.error("uploadTask fail");
                                console.error(uploadTaskRes);
                                if (typeof fail == "function") {
                                    fail(uploadTaskRes);
                                }
                            },
                            complete: uploadTaskRes => {
                                console.log("uploadTask complete");
                                if (typeof complete == "function") {
                                    complete(uploadTaskRes);
                                }
                            }
                        });

                        /*if (typeof progress === "function") {
                            uploadTask.onProgressUpdate(res => {
                                //TODO 上传进度
                                progress();
                            });
                        }*/
                    } else {
                        console.error("ajax not ok");
                        console.error(ajaxRes);
                        if (typeof fail == "function") {
                            fail(ajaxRes);
                        }
                    }
                },
                fail: (ajaxRes) => {
                    console.error("ajax fail");
                    console.error(ajaxRes);
                    if (typeof fail == "function") {
                        fail(ajaxRes);
                    }
                },
                complete: (ajaxRes) => {
                    console.log("ajax complete");
                    if (typeof complete == "function") {
                        complete(ajaxRes);
                    }
                }
            });
        }
    }
});
