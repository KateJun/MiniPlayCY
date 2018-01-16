//app.js
var req = require("/utils/request.js")
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
        
    var openid = wx.getStorageSync("openid")
    var session = wx.getStorageSync("session")
    var me = this
    me.globalData.openid = openid
    me.globalData.session = session
    wx.checkSession({
      success() {
        me.globalData.openid = openid
        me.globalData.session = session
        console.log("session 有效", openid, session)
      },
      fail() {
        me.globalData.openid = ''
        me.globalData.session = ''
        console.log("session 无效，需重新获取")
        // this.login()
      }
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (that.globalData.userInfo && that.globalData.openid && that.globalData.session) {
      typeof cb == "function" && cb(that.globalData.userInfo, null)
      that.updateInfo(that, null)
    } else {
      that.login(cb)
    }
  },

  login(cb) {
    var that = this
    // 登录
    wx.login({
      success: res0 => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("login code:", res0.code)
        that.globalData.loginCode = res0.code
        // 获取用户信息
        wx.getUserInfo({
          withCredentials: false,
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.userInfo
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
            that.updateInfo(that, res0.code)
          },
          fail: (res) => {
            wx.showModal({
              title: '用户未授权',
              content: "为了正常使用游戏评测功能，请按确认并在授权管理中选中'用户信息'开启",
              showCancel: false,
              confirmText: '确认',
              cancelText: '取消',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function (res) {
                      console.log(res)
                      that.getUserInfo(cb);
                    },
                    fail: function () {
                      that.getUserInfo(cb);
                    }
                  })
                }
              }
            })
          }
        })
        // that.updateInfo(that, res0.code)
      },
    })
  },

  updateInfo(that, code) {
    var openid = that.globalData.openid
    var session = that.globalData.session
    if (openid == '0' || session == '0' || !openid || !session) {
      var appid = 'wxfcb7146d74c576c8' //微信小程序appid  
      var secret = 'e5b71e88758204bec36e388f40c828c7'//微信小程序secret  
      //调用request请求api转换登录凭证  
      var param = {
        appid: appid,
        js_code: code
      }
      // 获取openID
      req.getOpenId(
        param,
        function (s) {
          openid = s.openid
          session = s.session
          that.globalData.openid = openid
          that.globalData.session = session

          // 存储id、session
          wx.setStorage({
            key: 'openid',
            data: openid,
          })
          wx.setStorage({
            key: 'session',
            data: session,
          })
          that.updateUser(that, openid, session)
        },
        function (f) {

        })
    } else {
      //可更新用户信息         
      that.updateUser(that, openid, session)
    }
  },

  updateUser(that, openid, session) {
    // 更新用户信息
    var uInfo = that.globalData.userInfo
    if (uInfo == null || that.globalData.hasUpdate || !openid || !session) {
      return
    }
    var d = {
      nick_name: uInfo.nickName,
      avatar_url: uInfo.avatarUrl,
      gender: uInfo.gender,
      language: uInfo.language,
      city: uInfo.city,
      province: uInfo.province,
      country: uInfo.country,
      openid: openid,
      session_code: session,
    }

    var user = JSON.stringify(d)
    console.log("user=", user)
    req.updateUser(d,
      function (s) {
        console.log("用户信息更新成功")
        that.globalData.hasUpdate = true
      }, function (f) {
        console.log("用户信息更新失败！！")
      })
  },

  globalData: {
    userInfo: null,
    loginCode: null,
    openid: '',
    session: '',
    hasUpdate: false,
    labels:[],
    update:true
  }
})