// pages/templateSelect/template.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    templates: [[{ id: 1, name: '', img: '../images/img_0.png', key: '', isChecked: true }, { id: 2, name: '', img: '../images/img_1.png', key: '', isChecked: false }]
      , [{ id: 3, name: '', img: '../images/img_0.png', key: '', isChecked: false }, { id: 4, name: '', img: '../images/img_1.png', key: '', isChecked: false }]
      , [{ id: 5, name: '', img: '../images/img_0.png', key: '', isChecked: false }, { id: 6, name: '', img: '../images/img_1.png', key: '', isChecked: false }]
      , [{ id: 7, name: '', img: '../images/img_0.png', key: '', isChecked: false }]
    ],
    contentHeight: 0,
    pixelRatio: 0,
    selectedOne: {},//被选中对象
    
  },
  selectedChanged: function (e) {
    // console.log(e.detail.value);
    for (var i = 0; i < this.data.templates.length; i++) {
      var tps = this.data.templates[i];
      for (var j = 0; j < tps.length; j++) {
        var item = tps[j];
        if (item.id == e.detail.value) {//设置选中样式
          var changed = {};
          changed['templates[' + i + '][' + j + '].isChecked'] = true;
          this.setData(changed);
          this.data.selectedOne = item;
        } else if (item.isChecked) {//去除选中样式
          var changed = {};
          changed['templates[' + i + '][' + j + '].isChecked'] = false;
          this.setData(changed);
        }
      }
    }
  },

  
  submit: function(e){
    wx.navigateTo({
      url: '../result/result?data=',
    })
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
        contentHeight: res.windowHeight - res.pixelRatio * 128
      });
    } catch (e) {
      // Do something when catch error
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