// pages/mine/mine.js

var req = require("../../utils/request.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labels: [{ name: "减肥", id: "r0", checked: "true" }, { name: "热词", id: "r1" }, { name: "励志", id: "r2" }, { name: "个性", id: "r3" }],
    currentPage: "减肥",
    defaultLabel: [],
    allHistory: [],
    contentHeight: 0,
    noHistory: false,
    templates: []
    // [[{ id: 1, name: '', img: '../images/img_0.png', key: '', isChecked: true }, { id: 2, name: '', img: '../images/img_1.png', key: '', isChecked: false }]
    //   , [{ id: 3, name: '', img: '../images/img_0.png', key: '', isChecked: false }, { id: 4, name: '', img: '../images/img_1.png', key: '', isChecked: false }]
    //   , [{ id: 5, name: '', img: '../images/img_0.png', key: '', isChecked: false }, { id: 6, name: '', img: '../images/img_1.png', key: '', isChecked: false }]
    //   , [{ id: 7, name: '', img: '../images/img_0.png', key: '', isChecked: false }]
    // ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var res = wx.getSystemInfoSync();
      this.data.pixelRatio = res.pixelRatio;
      this.data.screenHeight = res.windowHeight;
      this.setData({
        contentHeight: res.windowHeight
      });
    } catch (e) {
      // Do something when catch error
    }
    this.setData({
      labels: app.globalData.labels
    })

  },

  /**
   {
    "errcode": 0,
    "images": [
      {
        "create_time": "Tue, 09 Jan 2018 06:23:24 GMT",
        "image_id": "64eb4d26-f459-11e7-a005-34e6ad741fe4",
        "tag": "减肥",
        "url": "/static/generated/64eb4d26-f459-11e7-a005-34e6ad741fe4.png"
      }
    ]
  }
   */
  getSavedImages() {
    var param = {
      openid: app.globalData.openid,
      session_code: app.globalData.session
    }
    var that = this
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    req.getSaveList(param, suc => {
      wx.hideLoading()
      if (suc.images) {
        that.doTemp(that, suc.images)
        app.globalData.update = false
      }
    }, fail => {
      wx.hideLoading()
      console.error("server error", fail)
    })
  },

  doTemp(that, images) {
    var
      cur = "减肥",
      labels = [],
      all = [],
      mask = [];

    // images = [
    //   {
    //     "create_time": "Tue, 09 Jan 2018 06:23:24 GMT",
    //     "image_id": "64eb4d26-f459-11e7-a005-34e6ad741fe4",
    //     "tag": "减肥",
    //     "url": "/static/generated/64eb4d26-f459-11e7-a005-34e6ad741fe4.png"
    //   },
    //   {
    //     "create_time": "Tue, 09 Jan 2018 06:23:24 GMT",
    //     "image_id": "64eb4d26-f459-11e7-a005-34e6ad741fe4",
    //     "tag": "减肥",
    //     "url": "/static/generated/64eb4d26-f459-11e7-a005-34e6ad741fe4.png"
    //   },
    //   {
    //     "create_time": "Tue, 09 Jan 2018 06:23:24 GMT",
    //     "image_id": "64eb4d26-f459-11e7-a005-34e6ad741fe4",
    //     "tag": "减肥",
    //     "url": "/static/generated/64eb4d26-f459-11e7-a005-34e6ad741fe4.png"
    //   },
    //   {
    //     "create_time": "Tue, 09 Jan 2018 06:23:24 GMT",
    //     "image_id": "64eb4d26-f459-11e7-a005-34e6ad741fe4",
    //     "tag": "热词",
    //     "url": "/static/generated/64eb4d26-f459-11e7-a005-34e6ad741fe4.png"
    //   },
    //   {
    //     "create_time": "Tue, 09 Jan 2018 06:23:24 GMT",
    //     "image_id": "64eb4d26-f459-11e7-a005-34e6ad741fe4",
    //     "tag": "热词",
    //     "url": "/static/generated/64eb4d26-f459-11e7-a005-34e6ad741fe4.png"
    //   },
    //   {
    //     "create_time": "Tue, 09 Jan 2018 06:23:24 GMT",
    //     "image_id": "64eb4d26-f459-11e7-a005-34e6ad741fe4",
    //     "tag": "励志",
    //     "url": "/static/generated/64eb4d26-f459-11e7-a005-34e6ad741fe4.png"
    //   }
    //   // , {
    //   //   "create_time": "Tue, 09 Jan 2018 06:23:24 GMT",
    //   //   "image_id": "64eb4d26-f459-11e7-a005-34e6ad741fe4",
    //   //   "tag": "个性",
    //   //   "url": "/static/generated/64eb4d26-f459-11e7-a005-34e6ad741fe4.png"
    //   // }
    // ]
    let imageSize = images.length
    // let ll = Math.floor(imageSize >= 2 && imageSize % 2 == 0 ? imageSize / 2 : imageSize / 2 + 1)
    // for (let j = 0; j < ll; j++) {
    //   mask.push([])
    // }
    for (let i = 0; i < imageSize; i++) {
      let tmp = images[i]
      if (!tmp.tag) {
        tmp.tag = "减肥"
      }
      labels.push({
        // lid: i,
        name: tmp.tag,
        // id: "r" + i,
        checked: false
      })
      all.push({
        id: i,
        name: tmp.tag,
        img: req.url + tmp.url,
        key: tmp.image_id,
        isChecked: false
      })

    }
    that.data.allHistory = all
    console.log("all mask", all)
    labels = that.unique(labels)//去重
    console.log("已保存过mask的标签", labels)
    cur = that.initCurrentPage(labels[0])
    console.log("默认选中tab", cur)
    that.setData({
      // labels: labels,
      // templates: mask,
      currentPage: cur,
      defaultLabel: labels
    })
    that.initList(cur)
  },

  //显中第一个tab
  initCurrentPage(label) {
    var that = this,
      cur = "减肥";
    for (let k = 0; k < that.data.labels.length; k++) {
      if (label.name == that.data.labels[k].name) {
        // cur = that.data.labels[k].id
        cur = label.name
        break
      }
    }
    return cur
  },

  // 选中tab后筛选数据
  initList(curId) {
    var
      that = this,
      all = that.data.allHistory,
      masks = [],
      group = [];
    for (let k = 0; k < all.length; k++) {
      let t = all[k]
      if (t.name == curId) {
        masks.push(t)
      }
    }
    let imageSize = masks.length
    if (imageSize > 0) {
      let ll = Math.floor(imageSize >= 2 && imageSize % 2 == 0 ? imageSize / 2 : imageSize / 2 + 1)
      for (let j = 0; j < ll; j++) {
        group.push([])
      }
      for (let i = 0; i < imageSize; i++) {
        group[Math.floor(i / 2)].push(masks[i])
      }
    }
    that.setData({
      templates: group,
      noHistory: imageSize > 0
    })
  },

  //去除重复label元素
  unique(arr) {
    var result = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
      if (!obj[arr[i].name]) {
        result.push(arr[i]);
        obj[arr[i].name] = true;
      }
    }
    return result
  },

  //tab切换
  tabClick: function (e) {
    var
      me = this,
      name = e.detail.value;
    me.setData({
      currentPage: name,
    })
    me.initList(name)
  },

  selectedChanged: function (e) {
    var id = e.currentTarget.dataset.id
    console.log("选中的item", id);
    for (var i = 0; i < this.data.templates.length; i++) {
      var tps = this.data.templates[i];
      for (var j = 0; j < tps.length; j++) {
        var item = tps[j];
        if (item.id == id) {//设置选中样式
          var changed = {};
          changed['templates[' + i + '][' + j + '].isChecked'] = true;
          this.setData(changed);
          this.data.selectedOne = item;
          console.log("选中的item", item);
          // wx.navigateTo({
          //   url: '../result/result?fromMe=true&tag='+item.name+"&image_id="+item.key+"&mask="+item.img,
          // })
          this.scanImage(e)
        } else if (item.isChecked) {//去除选中样式
          var changed = {};
          changed['templates[' + i + '][' + j + '].isChecked'] = false;
          this.setData(changed);
        }
      }
    }
  },

  // 长按预览图片
  scanImage(e) {
    var id = e.currentTarget.dataset.id
    console.log("长按选中的item", id);
    for (var i = 0; i < this.data.templates.length; i++) {
      var tps = this.data.templates[i];
      for (var j = 0; j < tps.length; j++) {
        var item = tps[j];
        if (item.id == id) {//设置选中样式
          wx.previewImage({
            urls: [item.img],
          })
          break
        }
      }
    }

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
    if (app.globalData.update || this.data.allHistory == null || this.data.allHistory.length == 0) {
      this.getSavedImages()
    }
    console.log(app.globalData.update, "是否请求个人保存的图片？")
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
  onShareAppMessage: function () {

  }
})