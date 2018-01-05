// pages/result/result.js
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
      name: '保存',
      img: '../images/save.png',
      clickFunc: 'save'
    }, {
      name: '下载',
      img: '../images/download.png',
      clickFunc: 'download'
    }, {
      name: '分享',
      img: '../images/share.png',
    }],
    maxColorCount: 3,
    touchStartItems: [],
    selectedColors: [],//被选中的颜色
    //canvas相关
    screenWH: [],
    baseWidth: 750,
    ratio: 1,
    //生成的图片
    image: {
      xy: [0, 48],
      wh: [630, 630],
      imgUrl: '../images/img_0.png',
      radius: 10
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
  },
  download: function (e) {
    console.log("下载被点击");
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
    this.startLoading(0);
  },
  requestData: function () {
    this.showLoading();
    var that = this;
    wx.request({
      url: '',
      success: function (e) {

      },
      fail: function (e) {

      },
      complete: function () {
        that.finishProgressBar();
      }
    })
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

    this.drawQRCode(canvas);

    canvas.draw();
  },

  drawQRCode: function (canvas) {

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
  getSelectedColorPosition:function(position){
    for (var i = 0; i < this.data.selectedColors.length; i++){
      if (this.data.selectedColors[i].position == position){
        return i;
      }
    }
    return -1;
  },
  touchPaletteStart: function (res) {
    console.log('调色板点击开始');
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
    console.log('调色板点击结束');
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
        console.log("第" + i + "项颜色被触摸");
        return { position: i, color: allColorList[i] };
      }
    }
    return { position: -1, color: '' };
  },
  checkTouchPallette: function (finalX, finalY, position) {

    var newColorItem = this.getTouchPalletteColor(finalX, finalY);
    var newPosition = newColorItem.position;
    var newColorValue = newColorItem.color;
    if (newPosition < 0 || newPosition != position) {
      //触摸开始和结束非同一个颜色，此次点击无效
      return;
    }
    var selectedPosition = this.getSelectedColorPosition(newPosition);
    if (selectedPosition > -1) {//取消选中
      this.data.selectedColors.splice(selectedPosition, 1);
      console.log("第" + newPosition + "项颜色取消选中");
    } else {//选中新的
      if (this.data.selectedColors.length < this.data.maxColorCount) {
        this.data.selectedColors.push({
          position: newPosition,
          color: newColorValue
        });
        console.log("第" + newPosition + "项颜色被选中");
      } else {
        console.log("第" + newPosition + "项颜色被选中，但已选满");
        wx.showToast({
          title: '已选满' + this.data.selectedColors.length + '种'
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
    var data = options.data;
    this.getScreenWH();
    this.drawCanvas();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log("分享被触发");
  }
})