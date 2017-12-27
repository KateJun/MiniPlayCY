// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: {
      isLoading: false,//是否显示加载框
      progress: '0%'//进度
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
  requestData:function(){
    this.showLoading();
    var that = this;
    wx.request({
      url: '',
      success:function(e){

      },
      fail:function(e){

      },
      complete:function(){
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
    setTimeout(function(){
      var changed = {};
      changed['progress.isLoading'] = false;
      that.setData(changed);
    },1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = options.data;
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