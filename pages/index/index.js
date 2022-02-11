// pages/combine/combine.js
// pages/index/index.js
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        cardCur: 0,
        img: '',
        imgActive: true,
        resImg: '',
        picChoosed: false,
        imgList: [],
        currentbgId: 1,
        hatCenterX: 150,
        hatCenterY: 150,
        hatSize: 100,
        handleCenterX: 201,
        handleCenterY: 200,
        scale: 1,
        rotate: 0,
        bgSize: {
            width: 700,
            height: 500
        },
        fgSize: {
            width: 300,
            height: 200
        },
        images: {
            width: 300,
            height: 300
        }
    },
    onReady() {
        this.hat_center_x = this.data.hatCenterX;
        this.hat_center_y = this.data.hatCenterY;
        // this.cancel_center_x = this.data.cancelCenterX;
        // this.cancel_center_y = this.data.cancelCenterY;
        this.handle_center_x = this.data.handleCenterX;
        this.handle_center_y = this.data.handleCenterY;

        this.scale = this.data.scale;
        this.rotate = this.data.rotate;

        this.touch_target = "";
        this.start_x = 0;
        this.start_y = 0;
        let that =this
        wx.request({
            url: 'https://njtech.bamlubi.cn/get_bg_list', //这里填写你的接口路径
            data: {//这里写你要请求的参数
               x: '' ,
               y: ''
            },
            success: function(res) {
              console.log(res.data.data[0].bg_list.data)
              that.setData({
                  imgList:res.data.data[0].bg_list.data
              })
            }
          })
    },
    chooseImg(e) {
        this.setData({
            currentbgId: e.target.dataset.bgid
        });
    },
    imageActive: function () {
        this.setData({
            imgActive: !this.data.imgActive
        })
    },
    imgDeActive: function () {
        this.setData({
            imgActive: false
        })
    },
    imageLoad: function (e) {
        let that = this;
        let imgType = e.target.dataset.type
        var $width = e.detail.width, //获取图片真实宽度
            $height = e.detail.height,
            ratio = $width / $height; //图片的真实宽高比例
        // console.log(imgType)
        if (imgType == "0") {
            var viewWidth = 700, //设置图片显示宽度，左右留有16rpx边距
                viewHeight = 700 / ratio; //计算的高度值
            let temp_obj = {
                width: viewWidth,
                height: viewHeight
            }
            that.setData({
                bgSize: temp_obj
            })
        } else if (imgType == "1") {
            var image = that.data.images;
            var viewWidth = 450, //设置图片显示宽度，左右留有16rpx边距
                viewHeight = 450 / ratio; //计算的高度值
            //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
            image[e.target.dataset.bgId - 1] = {
                width: viewWidth,
                height: viewHeight
            }
            that.setData({
                images: image[e.target.dataset.bgId - 1]
            })
        } else {
            var viewWidth = 400, //设置图片显示宽度，左右留有16rpx边距
                viewHeight = 400 / ratio; //计算的高度值
            let temp_obj = {
                width: viewWidth,
                height: viewHeight
            }
            that.setData({
                fgSize: temp_obj,
                handleCenterX: (that.data.bgSize.width + viewWidth) / 2,
                handleCenterY: (that.data.bgSize.height + viewHeight) / 2,
                hatCenterX: that.data.bgSize.width / 2,
                hatCenterY: that.data.bgSize.height / 2,
            })
        }
    },
    uploadImage: function () {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                var tempFilesSize = res.tempFiles[0].size; //获取图片的大小，单位B
                console.log('原图大小:', tempFilesSize / 1000, 'kb')
                if (tempFilesSize <= 2000000) { //图片小于或者等于2M时 可以执行获取图片
                    wx.getFileSystemManager().readFile({
                        filePath: tempFilePaths[0],
                        encoding: 'base64',
                        success: res => {
                            // console.log('data:image/png;base64,' + res.data)
                            wx.showLoading({
                                title: '处理中',
                            })
                            wx.request({
                                url: 'https://njtech.bamlubi.cn/get_edited_image', //仅为示例，并非真实的接口地址
                                method: 'POST',
                                data: {
                                    "data": {
                                        "image": res.data,
                                        "bg_id": "1"
                                    }
                                },
                                success: res => {
                                    // console.log("-------------------------------------")
                                    // console.log(res.data.data[0].image_bs64)
                                    // console.log(res)

                                    that.setData({
                                        img: res.data.data[0].image_bs64,
                                        scale: 1
                                    })
                                    // console.log(res.data.data[0].image_bs64)
                                    // console.log("返回大小:"+that.data.img.size)
                                    wx.hideLoading()

                                    let query = wx.createSelectorQuery()
                                    query.select('#handle').boundingClientRect()
                                    query.select('#hat').boundingClientRect()
                                    query.exec(function (res) {
                                        that.data.handleCenterX = res[0].left
                                        that.data.handleCenterY = res[0].top
                                        that.data.hatCenterX = res[1].left
                                        that.data.hatCenterY = res[1].top
                                        // console.log(res[0].left,res[0].top,res[1].left,res[1].top);
                                    })
                                },
                                fail: err => {
                                    console.log(err)
                                    wx.hideLoading()
                                    wx.showToast({
                                        title: '当前网络繁忙',
                                    })
                                }
                            })
                        }
                    })
                } else { //图片大于2M，弹出一个提示框
                    wx.showToast({
                        title: '上传图片不能大于2M!', //标题
                        icon: 'none' //图标 none不使用图标，详情看官方文档
                    })
                }
            }
        });
    },
    touchStart(e) {
        this.hat_center_x = this.data.hatCenterX;
        this.hat_center_y = this.data.hatCenterY;
        this.handle_center_x = this.data.handleCenterX;
        this.handle_center_y = this.data.handleCenterY;
        console.log("touch start", e.target.id);
        if (e.target.id == "hat") {
            this.touch_target = "hat";
        } else if (e.target.id == "handle") {
            this.touch_target = "handle";
        } else {
            this.touch_target = "";
        }
        if (this.touch_target != "") {
            this.start_x = e.touches[0].clientX;
            this.start_y = e.touches[0].clientY;
        }
    },
    touchEnd(e) {
        console.log("touch end");
        this.hat_center_x = this.data.hatCenterX;
        this.hat_center_y = this.data.hatCenterY;
        this.handle_center_x = this.data.handleCenterX;
        this.handle_center_y = this.data.handleCenterY;
        this.touch_target = "";
        this.rotate = this.data.rotate;
        this.scale = this.data.scale;
        console.log(this.data.rotate)
    },
    touchMove(e) {
        // console.log("touch move");
        var current_x = e.touches[0].clientX;
        var current_y = e.touches[0].clientY;
        var moved_x = current_x - this.start_x;
        var moved_y = current_y - this.start_y;
        // console.log("move x", moved_x);
        // console.log("move y", moved_y);
        if (this.touch_target == "hat") {
            this.setData({
                hatCenterX: this.data.hatCenterX + moved_x,
                hatCenterY: this.data.hatCenterY + moved_y,
                handleCenterX: this.data.handleCenterX + moved_x,
                handleCenterY: this.data.handleCenterY + moved_y
            });
        }
        if (this.touch_target == "handle") {
            this.setData({
                handleCenterX: this.data.handleCenterX + moved_x,
                handleCenterY: this.data.handleCenterY + moved_y,
            });
            let diff_x_before = this.handle_center_x - this.hat_center_x;
            let diff_y_before = this.handle_center_y - this.hat_center_y;
            let diff_x_after = this.data.handleCenterX - this.hat_center_x;
            let diff_y_after = this.data.handleCenterY - this.hat_center_y;
            let distance_before = Math.sqrt(
                diff_x_before * diff_x_before + diff_y_before * diff_y_before
            );
            let distance_after = Math.sqrt(
                diff_x_after * diff_x_after + diff_y_after * diff_y_after
            );
            // console.log("handle_center_x", this.handle_center_x);
            // console.log("hat_center_x", this.hat_center_x);
            // console.log("handleCenterX", this.data.handleCenterX);
            // console.log(distance_before, distance_after, (distance_after / distance_before));
            let angle_before =
                (Math.atan2(diff_y_before, diff_x_before) / Math.PI) * 180;
            let angle_after =
                (Math.atan2(diff_y_after, diff_x_after) / Math.PI) * 180;
            this.setData({
                scale: (distance_after / distance_before) * this.scale,
                rotate: angle_after - angle_before + this.rotate
            });
            // console.log(this.data.scale)
        }
        this.start_x = current_x;
        this.start_y = current_y;
    },
    combinePic() {
        let that = this;
        let query = wx.createSelectorQuery()
        query.select('#bg').boundingClientRect()
        query.select('#hat').boundingClientRect()
        query.exec(function (res) {
            let bg_width = res[0].right - res[0].left
            let bg_height = res[0].bottom - res[0].top
            let bg_left = res[0].left
            let bg_top = res[0].top
            // console.log("背景", bg_width, res[0].right, res[0].left);

            let top = res[1].top - bg_top
            let left = res[1].left - bg_left
            let x_scale = left / bg_width
            let y_scale = top / bg_height
            let bf_scale = (res[1].bottom - res[1].top) / bg_height;
            // console.log("top", top)
            // console.log("left", left)
            // console.log("倍率", bf_scale)
            // console.log("x_scale", x_scale)
            // console.log("y_scale", y_scale)
            // console.log(bgPic)
            wx.showLoading({
                title: '处理中',
            })
            wx.request({
                url: 'https://njtech.bamlubi.cn/merge_with_bg', //仅为示例，并非真实的接口地址
                method: 'POST',
                data: {
                    "data": {
                        "image": that.data.img,
                        "bg_id": that.data.currentbgId.toString(),
                        "rel_height_ratio": bf_scale.toString(),
                        "rel_x": x_scale.toString(),
                        "rel_y": y_scale.toString(),
                        "rotate_d":that.data.rotate.toString()
                    }
                },
                success: res => {
                    // console.log("-------------------------------------")
                    // console.log(res.data.data[0].image_bs64)
                    // console.log(res)
                    that.setData({
                        resImg: res.data.data[0].image_bs64
                    })
                    that.showModal("Modal")
                    wx.hideLoading()
                },
                fail: err => {
                    console.log(err)
                    wx.hideLoading()
                    wx.showToast({
                        title: '当前网络繁忙',
                    })
                }
            })

        })

    },
    showModal: function (str) {
        this.setData({
            modalName: str
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    saveImg: function () {
        var imgSrc = this.data.resImg; //base64编码
        var save = wx.getFileSystemManager();
        var number = Math.random();
        save.writeFile({
            filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
            data: imgSrc,
            encoding: 'base64',
            success: res => {
                wx.saveImageToPhotosAlbum({
                    filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
                    success: function (res) {
                        wx.showToast({
                            title: '保存成功',
                        })
                    },
                    fail: function (err) {
                        console.log(err)
                    }
                })
                console.log(res)
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    cardSwiper(e) {
        this.setData({
            currentbgId: e.detail.current+1
        })
        console.log(e.detail.current)
    },
    jump_info:function(){
        wx.navigateToMiniProgram({
          appId: 'wxedcaebdaafe1441e',
          shortLink:'#小程序://南京工业大学招办/zk6E3IhTzJd0Ksi'
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {}
});