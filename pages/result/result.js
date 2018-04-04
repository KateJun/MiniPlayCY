// pages/result/result.js
var req = require("../../utils/request.js")
var app = getApp()
const retryDefault = 2
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: {
      isLoading: false,//是否显示加载框
      progress: '0%'//进度
    },
    buttons: [{
      name: '收藏',
      img: '../images/save.png',
      clickFunc: 'save'
    }, {
      name: '下载',
      img: '../images/download.png',
      clickFunc: 'download'
    }, {
      name: '分享',
      img: '../images/share.png',
      // clickFunc:"saveShareImage"
    }],
    qr_code: "../images/qr_code.jpg",
    maxColorCount: 3,
    touchStartItems: [],
    selectedColors: [{ color: "#3fe2e2", position: 0 }],//被选中的颜色
    retry: retryDefault,
    requestParam: {},//请求的配置
    defaultColorMask: [],
    isLoading:false,

    //canvas相关
    screenWH: [],
    baseWidth: 750,
    ratio: 1,
    //生成的图片
    image: {
      xy: [0, 48],
      wh: [630, 630],
      // imgUrl: 'http://tmp/wxfcb7146d74c576c8.o6zAJszBJSI5OiJZKN83T18IBcAc.60209cfb0bbc4d0ff129a412ee04013d.png',
      imgUrl: '../images/img_0.png',
      radius: 10,
      image_id: '',
    },
    //调色板
    tip: {
      text: '目前最多可支持选择三种颜色',
      color: '#49ddad',
      fontSize: 22,
      xy: [60, 20]
    },
    palette: {
      xy: [0, 60],
      itemRadius: 45,//每个色值的半径
      colorList: [["#3fe2e2", "#5252f9", "#f1e599", "#3cc781", "#000000"], ["#e7477f", "#f03fe1", "#aae987", "#9966cc", "#64d9f6"], ["#fccf4d", "#ff6f3c", "#00a0ff", "#dffcb5", "#ffcef3"]],
      colorTouchXYList: [],//所有颜色的点击xy范围,数组4个变量，x1,x2,y1,y2，1<2
      allColorList: [],//所有色值合并的数组
      itemMargin: 20,//每个色值互相的间距
      height: 348,//整个调色板的高度
      selectedCircleColor: "#08ffa1"//选中效果颜色
    },
    CANVAS_PIC: 'canvas_pic',
    CANVAS_PALETTE: 'canvas_palette',

  },
  save: function (e) {
    console.log("保存被点击");
    var me = this
    wx.showLoading({
      title: '图片收藏中...',
    })
    var param = {
      openid: app.globalData.openid,
      session_code: app.globalData.session,
      image_id: me.data.image.image_id,
      save: 1
    }
    req.saveImage(param, suc => {
      wx.hideLoading()
      wx.showToast({
        title: '收藏成功',
      })
      app.globalData.update = true
    }, fail => {
      wx.hideLoading()
      wx.showToast({
        title: '收藏失败',
      })
    }, com => {
      // wx.hideLoading()
    })
  },
  download: function (e) {
    console.log("下载被点击");
    var me = this
    wx.showLoading({
      title: '图片下载中...',
    })
    wx.saveImageToPhotosAlbum({
      filePath: me.data.image.imgUrl,
      success(e) {
        wx.hideLoading()
        wx.showToast({
          title: '成功下载到本地相册',
        })
      }, fail(e) {
        wx.hideLoading()
        wx.showToast({
          title: '下载失败',
        })
      }, complete(e) {
        // wx.hideLoading()
      }
    })
  },
  getScreenWH: function () {
    try {
      var res = wx.getSystemInfoSync();
      var wh = [];
      wh.push(res.windowWidth);
      wh.push(res.windowHeight);
      this.setData({
        screenWH: wh
      });
      this.data.screenWH = wh;
      this.data.ratio = this.data.screenWH[0] / this.data.baseWidth;
      return true;
    } catch (e) {
      console.log('Get System info error!');
      return false;
    }
  },
  showLoading: function () {
    wx.setNavigationBarColor({
      backgroundColor: "#213649",
      frontColor: "#ffffff",
      animation: {
        duration: 0,
        timingFunc: 'linear'
      }
    });
    this.showProgressBar(0);
  },

  showProgressBar: function (progress) {
    if (this.data.progress.progress == "100%") {
      return;
    }
    var changed = {};
    changed['progress.isLoading'] = true;
    changed['progress.progress'] = parseInt(progress) + "%";
    this.setData(changed);
    if (progress >= 99) {
      return;
    }
    var randomTime = Math.random() * 10000 % 800 + 1200;
    var newProgress = Math.random() * 10000 % 10 + 5 + progress;
    if (newProgress >= 99) {
      newProgress = 99;
    }
    var that = this;
    setTimeout(function () {
      that.showProgressBar.bind(that);
      that.showProgressBar(newProgress);
    }, randomTime);
  },
  finishProgressBar: function () {
    var that = this;
    var changed = {};
    changed['progress.isLoading'] = true;
    changed['progress.progress'] = "100%";
    this.setData(changed);
    setTimeout(function () {
      var changed = {};
      changed['progress.isLoading'] = false;
      that.setData(changed);
    }, 1000);
  },

  drawCanvas: function () {
    var that = this;
    this.drawImage();
    this.drawPalette();
  },

  drawImage: function () {
    var canvas = wx.createCanvasContext(this.data.CANVAS_PIC);
    var data = this.data.image;
    var w = this.scale(data.wh[0]);
    var h = this.scale(data.wh[1]);
    var x = (this.data.screenWH[0] - this.scale(data.xy[0]) - w) / 2;
    var y = this.scale(data.xy[1]);
    var r = this.scale(data.radius);
    var imgUrl = data.imgUrl;

    canvas.save();
    canvas.beginPath();
    canvas.moveTo(x, y + r);
    canvas.arc(x + r, y + r, r, -Math.PI, - Math.PI / 2);
    canvas.lineTo(x + w - r, y);
    canvas.arc(x + w - r, y + r, r, - Math.PI / 2, 0);
    canvas.lineTo(x + w, y + h - r);
    canvas.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    canvas.lineTo(x + r, y + h);
    canvas.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    canvas.lineTo(x, y + r);
    canvas.closePath();
    canvas.clip();

    canvas.drawImage(imgUrl, x, y, w, h);

    canvas.restore();


    x = x + w - this.scale(344) / 2
    y = y + h + this.scale(30)
    this.drawQRCode(canvas, x, y, this.scale(344) / 2, this.scale(344) / 2);

    canvas.draw();
  },

  drawQRCode: function (canvas, x, y, w, h) {
    //todo 344x344
    // canvas.drawImage(this.data.qr_code, x, y, w, h);
  },

  drawPalette: function () {
    var canvas = wx.createCanvasContext(this.data.CANVAS_PALETTE);
    this.drawTipText(canvas);
    this.drawColorPalette(canvas);
    canvas.draw();
  },

  drawTipText: function (canvas) {
    canvas.save();
    canvas.setFillStyle(this.data.tip.color);
    canvas.setFontSize(this.scale(this.data.tip.fontSize));
    canvas.fillText(this.data.tip.text, this.scale(this.data.tip.xy[0]), this.scale(this.data.tip.xy[1] + this.data.tip.fontSize));
    canvas.restore();
  },

  drawColorPalette: function (canvas) {
    canvas.save();
    var data = this.data.palette;
    var h = this.scale(data.height);
    var radius = this.scale(data.itemRadius);
    var xy = data.xy;
    var itemMargin = this.scale(data.itemMargin);
    var colorList = data.colorList;
    var maxCountOneLine = 0;//一行的最多项目数
    for (var i = 0; i < colorList.length; i++) {
      maxCountOneLine = Math.max(maxCountOneLine, colorList[i].length);
    }
    var marginTop = (h - (radius + itemMargin) * 2 * colorList.length) / 2;
    var marginLeft = (this.data.screenWH[0] - (radius + itemMargin) * 2 * maxCountOneLine) / 2;

    var left = this.scale(xy[0]) + marginLeft;
    var top = this.scale(xy[1]) + marginTop;
    var touchList = null;
    var allColorList = null;
    if (!data.colorTouchXYList || data.colorTouchXYList.length < 1) {
      touchList = [];
      data.colorTouchXYList = touchList;
    }
    if (!data.allColorList || data.allColorList.length < 1) {
      allColorList = [];
      data.allColorList = allColorList;
    }
    var position = 0;
    for (var i = 0; i < colorList.length; i++) {
      var y = top + radius + itemMargin + i * (radius + itemMargin) * 2;
      var colorEachLine = colorList[i];
      for (var j = 0; j < colorEachLine.length; j++) {
        var color = colorEachLine[j];
        var x = left + radius + itemMargin + j * (radius + itemMargin) * 2;
        canvas.beginPath();
        canvas.arc(x, y, radius, 0, 2 * Math.PI);
        canvas.setFillStyle(color);
        canvas.fill();
        canvas.closePath();
        if (touchList) {
          var touch = [];
          touchList.push(touch);
          touch.push(x - radius - itemMargin);
          touch.push(x + radius + itemMargin);
          touch.push(y - radius - itemMargin);
          touch.push(y + radius + itemMargin);
        }
        if (allColorList) {
          allColorList.push(color);
        }

        if (this.getSelectedColorPosition(position) > -1) {
          canvas.beginPath();
          canvas.arc(x, y, radius, 0, 2 * Math.PI);
          canvas.setStrokeStyle(data.selectedCircleColor);
          canvas.setLineWidth(this.scale(4));
          canvas.stroke();
          canvas.closePath();
        }
        position++;
      }
    }
    canvas.restore();
  },
  getSelectedColorPosition: function (position) {
    for (var i = 0; i < this.data.selectedColors.length; i++) {
      if (this.data.selectedColors[i].position == position) {
        return i;
      }
    }
    return -1;
  },
  touchPaletteStart: function (res) {
    // console.log('调色板点击开始');
    var t = res.changedTouches[0];
    var x = t.x;
    var y = t.y;
    var id = t.identifier;
    var that = this;
    this.data.touchStartItems.push({
      id: id,
      position: that.getTouchPalletteColor(x, y).position
    });
  },
  touchPalletteEnd: function (res) {
    // console.log('调色板点击结束');
    var t = res.changedTouches[0];
    var x = t.x;
    var y = t.y;
    var id = t.identifier;
    if (this.data.touchStartItems.length > -1) {
      for (var i = 0; i < this.data.touchStartItems.length; i++) {
        var touch = this.data.touchStartItems[i];
        if (touch.id == id) {
          this.checkTouchPallette(x, y, touch.position);
          this.data.touchStartItems.splice(i, 1);
          break;
        }
      }

    }
  },
  getTouchPalletteColor: function (x, y) {
    var touchXYList = this.data.palette.colorTouchXYList;
    var allColorList = this.data.palette.allColorList;
    for (var i = 0; i < touchXYList.length && i < allColorList.length; i++) {
      var touchXY = touchXYList[i];
      if (x >= touchXY[0] && x <= touchXY[1] && y >= touchXY[2] && y <= touchXY[3]) {
        // console.log("第" + i + "项颜色被触摸");
        return { position: i, color: allColorList[i] };
      }
    }
    return { position: -1, color: '' };
  },
  checkTouchPallette: function (finalX, finalY, position) {
    var newColorItem = this.getTouchPalletteColor(finalX, finalY);
    var newPosition = newColorItem.position;
    var newColorValue = newColorItem.color;
    if (newPosition < 0 || newPosition != position || this.data.isLoading) {
      //触摸开始和结束非同一个颜色，此次点击无效
      return;
    }
    var selectedPosition = this.getSelectedColorPosition(newPosition);
    if (selectedPosition > -1) {//取消选中
      this.data.selectedColors.splice(selectedPosition, 1);
      // console.log("第" + newPosition + "项颜色取消选中");
      this.requestData()
    } else {//选中新的
      if (this.data.selectedColors.length < this.data.maxColorCount) {
        this.data.selectedColors.push({
          position: newPosition,
          color: newColorValue
        });
        // console.log("第" + newPosition + "项颜色被选中");
        this.requestData()
      } else {
        // console.log("第" + newPosition + "项颜色被选中，但已选满");
        wx.showToast({
          title: '已选' + this.data.selectedColors.length + '种'
        });
      }
    }
    this.drawPalette();
  },
  scale: function (x) {
    return x * this.data.ratio;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var
      that = this,
      mask_id = options.mask_id,
      mask = options.mask,
      text = options.text,
      text_id = options.text_id,
      tag = options.tag,
      fromMine = options.fromMe;

    console.log("result", mask_id, text, text_id, tag)

    that.getScreenWH();
    that.drawCanvas();

    that.data.mask_id = mask_id
    that.data.text_id = text_id
    that.data.text = text
    that.data.tag = tag
    that.data.retry = retryDefault

    wx.getImageInfo({
      src: mask,
      success(res) {
        that.setData({
          'image.imgUrl': res.path
        })
        that.data.image.imgUrl = res.path
        that.drawImage()
      }, fail(e) {
        // wx.showToast({
        //   title: '模板加载失败',
        // })
      }
    })
    if (!fromMine) {//从模板进来
      that.initColorMask(mask_id, text)
      that.requestData()
    } else {//从我的进来
      var rq = that.loadCacheImageSetting(options.image_id)
      if(!rq){
        that.log("未找到该图片的本地配置")
        return
      }
      that.initColorMask(rq.mask_id, rq.text)
      var cArr = rq.colors
      var allC = Array()
      var select = []
      for (var i = 0; i < that.data.palette.colorList.length; i++) {
        var tmp = (that.data.palette.colorList[i])
        allC = tmp.reduce(function (coll, item) {
          coll.push(item);
          return coll;
        }, allC);
      }
      for (i = 0; i < allC.length; i++) {
        for (var j = 0; j < cArr.length; j++) {
          if (allC[i] == cArr[j]) {
            select.push({
              position: i,
              color: cArr[j]
            });
          }
        }
      }
      that.log("已选择的颜色：", select)
      that.data.mask_id = rq.mask_id
      that.data.text_id = rq.text_id
      that.data.text = rq.text
      that.data.tag = rq.tag
      that.setData({
        'image.image_id': options.image_id,
        selectedColors: select,
        requestParam: rq
      })
      //画出选的颜色
      that.drawPalette();
    }
  },
  // 请求图片id
  requestData() {
    var me = this
    // me.showLoading()
    wx.showLoading({
      title: '图片渲染中...',
      mask:true
    })
    me.setData({
      isLoading:true
    })
    var param = me.initParamWithOpenid()
    var equal = me.compare()
    var imageId = me.loadCache(me.data.selectedColors, me.data.mask_id, me.data.text)
    if (imageId.length > 0 || equal) {
      me.setData({
        'image.image_id': imageId
      })
      me.loadImage(imageId)
    } else {
      req.imageTask(param, suc => {
        console.log("success1", suc, suc.image_id)
        me.setData({
          'image.image_id': suc.image_id
        })
        setTimeout(function () {
          me.loadImage(suc.image_id)
        }, 1000 * 5)
      }, fail => {
        wx.hideLoading()
        console.error("error", fail)
        wx.showToast({
          title: '加载失败',
        })
        me.setData({
          isLoading: false
        })
      })
    }
  },

  // 根据图片id获取图片
  loadImage(imageId) {
    var me = this
    var abc = req.getImageUrl + "?openid=" + app.globalData.openid + "&session_code=" + app.globalData.session + "&image_id=" + imageId
    console.log("image url=", abc)
    wx.getImageInfo({
      src: abc,
      success: function (res) {
        wx.hideLoading()
        console.log("success2", res)
        let temp = me.data.defaultColorMask
        if (!temp) {
          temp = []
        }
        // 存在重复的key数组
        temp.push(JSON.stringify(me.getColor(me.data.selectedColors)) + "&" + me.data.mask_id + "&" + me.data.text)
        temp = me.unique(temp)
        me.setData({
          'image.imgUrl': res.path,
          defaultColorMask: temp
        })
        me.data.image.imgUrl = res.path
        me.drawImage() //重新绘制图片
        me.resetRetry() //重置重试次数
        me.saveCacheImageSetting()//正常获取到图片，则保存当次请求的参数, key=imageID, v=param
        me.saveCache(imageId) //保存图片配置，key=param ,v=imageID
      }, fail(f) {
        if (me.data.retry > 0) {
          let ty = me.data.retry - 1
          me.setData({
            retry: ty
          })
          me.loadImage(me.data.image.image_id)
        } else {
          me.resetRetry()
          wx.hideLoading()
          console.error("error", f)
          wx.showToast({
            title: '加载失败',
          })
        }
      },
      complete(e) {
        me.setData({
          isLoading: false
        })
      }
    })

  },

  //失败重试次数，重置
  resetRetry() {
    this.setData({
      retry: retryDefault
    })
  },
  // 初始化数据
  initParam() {
    var me = this
    var colors = me.getColor(me.data.selectedColors)
    var txtId = me.data.text_id
    // var txtId = (me.data.text_id==-1?0:me.data.text_id)
    var param = {
      "mask_id": (me.data.mask_id),
      "colors": colors,
      "font": "",
      "text": me.data.text,
      "text_id":txtId,
      "tag": me.data.tag
    }
    return param
  },

  initParamWithOpenid() {
    var p = this.initParam()
    p.openid = app.globalData.openid
    p.session_code = app.globalData.session
    return p
  },

  getColor(selectedColors) {
    var me = this
    var colors = []
    for (let i = 0; i < selectedColors.length; i++) {
      colors.push(selectedColors[i].color)
    }
    return colors
  },

  initColorMask(mask_id, text) {
    try {
      var res = wx.getStorageSync(mask_id + text)//获取colors+mask_id数组
      console.log("当前模板下已有的颜色模板组合：", res)
      var cm = JSON.parse(res)
      this.setData({
        defaultColorMask: cm
      })
      this.data.defaultColorMask = cm
    } catch (e) {
      // Do something when catch error
    }
  },

  saveColorMask() {
    var me = this,
      res = me.data.defaultColorMask;
    if (res) {
      res = me.unique(res)
      wx.setStorage({
        key: me.data.mask_id + me.data.text,
        data: JSON.stringify(res),
      })
      me.log("保存图片模板：" + res)
    } else {
      me.log("保存图片模板undefind：" + res)
    }
  },
  //去除重复label元素
  unique(arr) {
    var result = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
      if (!obj[arr[i]]) {
        result.push(arr[i]);
        obj[arr[i]] = true;
      }
    }
    return result
  },

  // 根据配置加载本地缓存的图片id
  loadCache(colors, mask_id, text) {
    var color = this.getColor(colors) //选的颜色
    if (color.length <= 1) {
      var key = JSON.stringify(color) + "&" + mask_id + "&" + text //颜色+模板id+text=key
      var image_id = wx.getStorageSync(key)
    } else {
      var total = this.doCombination(color)
      for (var i = 0; i < total.length; i++) {
        // console.log("排列组合颜色：", total[i]);
        key = JSON.stringify(total[i]) + "&" + mask_id + "&" + text //颜色+模板id+text=key
        image_id = wx.getStorageSync(key)
        if (image_id.length > 0) {
          break
        }
      }
    }
    this.log("获取图片id：k=" + key + ",v=" + image_id)
    return image_id
  },

  // 全排列颜色组合
  doCombination(arr) {
    var flag = [];
    var result = [];//保存arr的下标
    for (var i = 0; i < arr.length; i++) {
      flag[i] = 0;
      result[i] = i;
    }
    var arrangementList = [];//放置所有的排列情况
    //js实现全排列
    var arrange = function (step) {
      //边界判断条件
      if (step == arr.length) {
        var tmpArr = [];
        for (var i = 0; i < arr.length; i++) {
          tmpArr[i] = arr[result[i]];
        }
        arrangementList.push(tmpArr);
      } else if (step < arr.length) {
        //递归
        for (var i = 0; i < arr.length; i++) {
          if (flag[i] == 0) {
            result[step] = i;
            flag[i] = 1;
            arrange(step + 1);
            flag[i] = 0;
          }
        }
      }
    }
    arrange(0);
    return arrangementList;

  },

  compare() {
    var me = this,
      equal = false,
      selectColor = me.getColor(me.data.selectedColors),//[,"#ffff"]
      cms = me.data.defaultColorMask;//["#ffff#ffff&1","#ffff#ffff&1"]
    if (selectColor.length > 0) {
      var exp2 = new RegExp("(^[^#]*(#[^#]+){" + selectColor.length + "}$)", "gi");
      for (var i = 0; i < cms.length; i++) {
        var result = Array(selectColor.length)
        if (!exp2.test(cms[i])) {
          continue
        }
        for (var j = 0; j < selectColor.length; j++) {
          result.push(cms[i].indexOf(selectColor[j]) != -1)
        }
        if (result.indexOf(false) < 0) {
          equal = true
          break
        }
      }
    } else {
      for (var k = 0; k < cms.length; k++) {
        if (cms[k].indexOf("[]") >= 0) {
          equal = true
          break
        }
      }
    }
    return equal
  },

  // 保存图片id
  saveCache(image_id) {
    var color = this.getColor(this.data.selectedColors) //选的颜色
    var key = JSON.stringify(color) + "&" + this.data.mask_id + "&" + this.data.text //颜色+模板id+text=key
    wx.setStorageSync(key, image_id)
    this.log("保存图片id：k=" + key + ",v=" + image_id)
  },

  // loadCacheImageUrl(image_id) {
  //   return wx.getStorageSync(image_id)
  // },
  /**
   * {
        "mask_id": (me.data.mask_id),
        "colors": colors,
        "font": "",
        "text": me.data.text,
        "text_id": me.data.text_id,
        "tag": me.data.tag,
        "image_id":
      }
   */
  loadCacheImageSetting(image_id) {
    var cacheSettingJson = wx.getStorageSync(image_id)
    this.log("请求过的图片配置缓存：" + cacheSettingJson)
    return JSON.parse(cacheSettingJson)
  },

  // 保存请求过的图片配置
  saveCacheImageSetting() {
    var me = this
    var param = me.initParam()
    param.image_id = me.data.image.image_id
    var json = JSON.stringify(param)
    wx.setStorage({
      key: param.image_id,
      data: json
    })
    // me.setData({
    //   requestParam: json
    // })
    me.log("请求过的图片配置：" + JSON.stringify(param))
  },

  // equalsImageSetting(oldSetting, newSetting) {
  //   var equal = false
  //   if (oldSetting && newSetting) {
  //     var oldColor = JSON.stringify(JSON.parse(oldSetting).colors)
  //     var newColor = newSetting.colors
  //     me.log("是否相等?" + oldColor + "," + newColor)
  //     if (oldColor && newColor && oldSetting.mask_id == newSetting.mask_id) {
  //       for (let i = 0; i < newColor.length; i++) {
  //         if (oldColor.indexOf(newColor[i]) == -1) {
  //           equal = false
  //           break
  //         } else {
  //           equal = true
  //         }
  //       }
  //     }
  //   }
  //   return equal
  // },

  // 分享图片
  saveShareImage() {
    var me = this
    wx.canvasToTempFilePath({
      canvasId: me.data.CANVAS_PIC,
      // x: 0,
      // y: 0,
      // width: me.data.screenWH[0],
      // height: me.data.screenWH[1],
      // destWidth: me.data.screenWH[0],
      // destHeight: me.data.screenWH[1],
      success(res) {
        var image = res.tempFilePath
        console.log(image)
        wx.previewImage({
          urls: [image],
          current: image
        })

      }
    })
  },
  onUnload() {
    this.saveColorMask()
  },

  log(msg) {
    console.log(msg)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log("分享被触发");
    return {
      title: '词云为您定制个性头像',
      path: '/pages/index/index',
      imageUrl: e,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
        req.share(app.globalData.openid)
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  }
})