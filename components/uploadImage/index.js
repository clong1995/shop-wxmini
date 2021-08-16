const ajax = require('../../utils/ajax').ajax;
let _canvas = null;
let _context = null;
Component({
    methods: {
        upload(maxWidth = 0, maxHeight = 0, success, fail, complete) {
            if (typeof success == "function") {
                wx.showLoading({
                    mask: true,
                    title: '请稍后',
                });
                const _this = this;
                wx.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    sourceType: ['album', 'camera'],
                    success(chooseImage) {
                        console.log("chooseImage success");
                        wx.getImageInfo({
                            src: chooseImage.tempFilePaths[0],
                            success(imageInfo) {
                                console.log("imageInfo success");
                                const ratio = imageInfo.width / imageInfo.height;
                                const path = imageInfo.path;
                                if (maxWidth && maxHeight && (imageInfo.width > maxWidth || imageInfo.height > maxHeight)) {
                                    //压缩
                                    const size = chooseImage.tempFiles[0].size;
                                    const quality = (size / Math.pow(1000, 2)) > 1 ? (1 / size) : 1;

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
                                    if (!_canvas || !_context) {
                                        const query = wx.createSelectorQuery()
                                        query.in(_this).select('#myCanvas')
                                            .fields({
                                                node: true,
                                                size: true
                                            })
                                            .exec((res) => {
                                                _canvas = res[0].node;
                                                _context = _canvas.getContext('2d');
                                                _this.canvasToTempFilePath(_canvas,_context, path, targetWidth, targetHeight, quality,success,fail,complete);
                                            });
                                    } else {
                                        _this.canvasToTempFilePath(_canvas,_context, path, targetWidth, targetHeight, quality,success,fail,complete);
                                    }
                                } else {
                                    //不用压缩
                                    // 压缩成功，上传
                                    _this.putOss(path, imageInfo.width + "_" + imageInfo.height,
                                        putOss => {
                                            success(putOss);
                                        },
                                        (putOss) => {
                                            console.log("putOss complete");
                                            console.error("putOss fail");
                                            console.error(putOss);
                                            if (typeof fail == "function") {
                                                fail(putOss);
                                            }
                                        },
                                        (putOss) => {
                                            wx.hideLoading();
                                            if (typeof complete == "function") {
                                                complete(putOss);
                                            }
                                        });
                                }
                            },
                            fail(imageInfo) {
                                wx.hideLoading();
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
                        wx.hideLoading();
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
                        //TODO 真机预览不开启调试台无法上传，原因是没有配置合法域名
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
                                wx.hideLoading();
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
                    wx.hideLoading();
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
        },
        canvasToTempFilePath(canvas,context, path, targetWidth, targetHeight, quality, success, fail, complete) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const image = _canvas.createImage();
            image.onload = () => {
                console.log("image onload success");
                // 把图片画到离屏 canvas 上
                context.clearRect(0, 0, targetWidth, targetHeight);
                context.drawImage(image, 0, 0, targetWidth, targetHeight);
                const _this = this;
                wx.canvasToTempFilePath({
                    width: targetWidth,
                    height: targetHeight,
                    destWidth: targetWidth,
                    destHeight: targetHeight,
                    fileType: "jpg",
                    canvas: canvas,
                    quality: quality,
                    success: (canvasToTempFilePath) => {
                        console.log("canvasToTempFilePath success");
                        _this.putOss(canvasToTempFilePath.tempFilePath, targetWidth + "_" + targetHeight,
                            putOss => {
                                success(putOss);
                            },
                            (putOss) => {
                                wx.hideLoading();
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
                        wx.hideLoading();
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
                });
            }
            image.src = path;
        }
    }
});
