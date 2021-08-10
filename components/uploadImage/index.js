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
                                    ctx.draw(false, () => {
                                        wx.canvasToTempFilePath({
                                            canvasId: 'imageCanvas',
                                            success: (canvasToTempFilePath) => {
                                                console.log("draw success");
                                                //TODO 压缩成功，上传
                                                success({
                                                    tempFilePath: canvasToTempFilePath.tempFilePath,
                                                    ratio: maxWidth / maxHeight
                                                });
                                            },
                                            fail(canvasToTempFilePath) {
                                                console.error("draw fail");
                                                console.error(canvasToTempFilePath);
                                                if (typeof fail == "function") {
                                                    console.error(canvasToTempFilePath);
                                                    fail(canvasToTempFilePath);
                                                }
                                            },
                                            complete(canvasToTempFilePath) {
                                                console.log("draw complete");
                                                if (typeof complete == "function") {
                                                    complete(canvasToTempFilePath);
                                                }
                                            }
                                        },_this)
                                    });
                                } else {
                                    //不用压缩
                                    success({
                                        tempFilePath: path,
                                        ratio: ratio
                                    });
                                }
                            },
                            fail(imageInfo) {
                                console.error("imageInfo fail");
                                if (typeof fail == "function") {
                                    console.error(imageInfo);
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
                        if (typeof fail == "function") {
                            console.error(chooseImage);
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
        }
    }
});
