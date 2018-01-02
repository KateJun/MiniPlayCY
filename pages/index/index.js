//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    labels: [{ name: "热词", id: "r0", checked: "true" }, { name: "减肥", id: "r1" }, { name: "励志", id: "r2" }, { name: "个性", id: "r3" }],
    currentPage: "r0",
    items: [],
    startX: 0, //开始坐标
    startY: 0
  },
 
  onLoad: function () {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo,code) {
        if (userInfo.avatarUrl == null || userInfo.avatarUrl.length == 0) {
          userInfo.avatarUrl = "../../images/avatar_default.png"
        }
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true
        })

      }) 
    }

    var tmp=''
    if (!tmp) {
      console.log("null or undefined or NaN");
    } else {
      console.log("not  null or undefined or NaN");
    }

   var items=[]
    for (var i = 0; i < 4; i++) {
     items.push({
        content: i % 2 != 0 ? i + " 没有吃饱只有一个烦恼，吃饱了就有无数个烦恼啊烦恼。" : "",
        // content: i + " 要么瘦，要么死",
        isTouchMove: false, //默认全隐藏删除
        isNull: i % 2 == 0
      })
    }
    var ap=getApp()
    var me = this
    ap.getUserInfo(function(user,e){
      me.data.items.push({
        content: e,
        isTouchMove: false, //默认全隐藏删除
        isNull: false
      })
      me.setData({
        items: me.data.items
      })
    })

    this.setData({
      items:items
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //tab切换
  tabClick: function (e) {
    var me = this;
    var v = e.detail.value

    me.setData({
      currentPage: v,

    })
  },
  //换一批
  refresh() {
    console.log("换一批")
  },
  // 制作头像
  createPhoto(e) {
    console.log("制作头像")
    console.log(e.detail.formId)
    var form = e.detail.formId
    this.data.items[0].content = form
    this.data.items[0].isNull = (form.length == 0)

    this.setData({
      items: this.data.items
    })
    wx.navigateTo({
      url: '../templateSelect/template',
    })
  },

  editor(e) {
    console.log("修改内容", e.detail)
    var newValue = e.detail.value
    let index = Number(e.currentTarget.dataset.id)

    this.data.items[index].content = newValue
    this.data.items[index].isNull = (newValue.length == 0)
    // this.data.items[index].isTouchMove = (newValue.length == 0)

    this.setData({
      items: this.data.items
    })

  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    if (that.data.items[index].isNull) {
      return
    }

    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    let index = Number(e.currentTarget.dataset.index)
    let items = this.data.items
    items.splice(index, 1)
    items.push({
      isNull: true,
      content: "",
      isTouchMove: false
    })
    this.setData({
      items: items
    })
  },

  onShareAppMessage(e) {
    return {
      title: '词云为你定制个性头像',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })

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
