//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    url:'',
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  var me = this
    wx.getImageInfo({
      src: 'http://172.19.11.56:8080/word_image/get_image?openid=oxp8U0cXgne0cIxFxXNLUhPTG6jQ&session_code=3c549c546f8b070593f7b4b12ffe68138dcbb6867c97b70f9f58723140680832&image_id=8090dfa2-f5e7-11e7-ab4b-34e6ad741fe4',
      success(e){
        me.setData({
          url:e.path
        })
      }
    })
  }
})
