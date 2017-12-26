// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labels: [{ name: "热词", id: "r0", checked: "true" }, { name: "减肥", id: "r1" }, { name: "励志", id: "r2" }, { name: "个性", id: "r3" }],
    currentPage: "r0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setNavigationBarTitle({
    //   title: 'PLAY词云',
    // })
  },

  //tab切换
  tabClick: function (e) {
    var me = this;
    var v = e.detail.value

    me.setData({
      currentPage: v,

    })
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