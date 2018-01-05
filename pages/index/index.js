//index.js
//获取应用实例
const app = getApp()
var req = require("../../utils/request.js")
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    labels: [{ name: "热词", id: "r0", checked: "true" }, { name: "减肥", id: "r1" }, { name: "励志", id: "r2" }, { name: "个性", id: "r3" }],// { name: "个性", id: "r6" }, { name: "个性", id: "r4" }],
    currentPage: "r0",
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    currPage: 0,
    masks: [],
    allItems: [],
    curID: 0
  },

  onLoad: function () {
    var that = this
    
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
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
    app.getUserInfo(function (userInfo, code) {
      if (userInfo.avatarUrl == null || userInfo.avatarUrl.length == 0) {
        userInfo.avatarUrl = "../../images/avatar_default.png"
      }
      that.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })

    })
    // }
    // var items = []
    // for (var i = 0; i < 5; i++) {
    //   items.push({
    //     content: i % 2 != 0 ? i + " 没有吃饱只有一个烦恼，吃饱了就有无数个烦恼啊烦恼。" : "",
    //     // content: i + " 要么瘦，要么死",
    //     isTouchMove: false, //默认全隐藏删除
    //     isNull: i % 2 == 0
    //   })
    // }
    that.getDataFromServer()

    // this.setData({
    //   items: items
    // })
  },

  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

  //tab切换
  tabClick: function (e) {
    var me = this;
    var v = e.detail.value
    for (let i = 0; i < me.data.labels.length; i++) {
      if (v == me.data.labels[i].id) {
        var index = i
        var curID = me.data.labels[i].lid
        me.initCurrentData(curID)
        break
      }
    }

    me.setData({
      currentPage: v,
      currPage: index,
      curID: curID
    })
  },
  //换一批
  refresh() {
    console.log("换一批")
    this.initCurrentData(this.data.curID)
  },

  //获取标签，模板信息
  getDataFromServer() {
    var that = this
    req.getCYSetting(
      res => {
        console.log(res)
        that.setData({
          masks: res.mask
        })
        that.doTemp(res.text)
      }, fail => {
        console.error("setting error", fail)
      })
  },

  // 处理数据
  /**
   * "text": [
      {
        "id": 1,
        "tag": "减肥",
        "text":[{id:1,"content":"如果连自己的体重都控制不了何以控制自己的人生",isTouchMove:false,isNull:false}]
      },
      {
        "id": 2,
        "tag": "热词",
        "text":"吃饱有力气减肥" 
      }
    ]
   */
  doTemp(text) {
    var
      currentPage = 'r0',
      that = this,
      all = [],
      labels = [],
      items = [],
      tmp;

    text = [
      {
        id: 1,
        tag: "减肥",
        text: "不瘦十斤，不换头像"
      }, {
        id: 1,
        tag: "减肥",
        text: "连体重都控制不了，何以控制人生？"
      }, {
        id: 1,
        tag: "减肥",
        text: "女人不对自己狠心，男人就会对自己死心。"
      }, {
        id: 1,
        tag: "减肥",
        text: "没有吃饱只有一个烦恼，吃饱了有无数烦恼"
      },
      {
        id: 1,
        tag: "减肥",
        text: "一个烦恼，吃饱了有无数烦恼"
      }, {
        id: 1,
        tag: "减肥",
        text: "没有一个烦恼，吃饱了有无数烦恼"
      }, {
        id: 1,
        tag: "减肥",
        text: "吃饱有一个烦恼，吃饱了有无数烦恼"
      }, {
        id: 1,
        tag: "减肥",
        text: "没有无数烦恼"
      }, {
        id: 2,
        tag: "热词",
        text: "吃饱了有无数烦恼"
      }, {
        id: 2,
        tag: "热词",
        text: "吃饱了有无数烦恼"
      }, {
        id: 2,
        tag: "热词",
        text: "吃饱了有无数烦恼"
      }, {
        id: 2,
        tag: "热词",
        text: "吃饱了有无数烦恼"
      }, {
        id: 2,
        tag: "热词",
        text: "吃饱了有无数烦恼"
      }, {
        id: 3,
        tag: "励志",
        text: "吃饱励志"
      }, {
        id: 4,
        tag: "个性",
        text: "没有个性"
      }
    ]
    for (let i = 0; i < text.length; i++) {
      tmp = text[i]
      all.push({
        id: tmp.id,
        content: tmp.text,
        isTouchMove: false, //默认全隐藏删除
        isNull: false
      })
      labels.push({
        lid: tmp.id,
        name: tmp.tag,
        id: 'r' + i,
        checked: i == 0
      })
    }
    console.log(labels)
    labels = that.unique(labels)
    console.log(all)
    console.log(labels)
    currentPage = labels[0].id
    that.data.allItems = all
    that.setData({
      labels: labels,
      currentPage: currentPage,
      curID: labels[0].lid
    })
    that.initCurrentData(labels[0].lid)
  },

  initCurrentData(curID) {
    var
      that = this,
      all = that.data.allItems,
      items = [];
    for (let k = 0; k < all.length; k++) {
      let t = all[k]
      if (t.id == curID) {
        items.push(t)
      }
    }
    while (items.length < 5) {
      items.push({
        id: items[0].id,
        content: '',
        isTouchMove: false, //默认全隐藏删除
        isNull: true
      })
    }
    if (items.length > 5) {
      var radomItems = [],
        oldIndex = 0,
        i = items.length;
      while (radomItems.length < 5) {
        oldIndex = Math.floor(Math.random() * items.length)
        radomItems.push(items[oldIndex])
        items.splice(oldIndex,1)
      }
      items = radomItems
    }
    that.setData({
      items: items
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
    var me = this
    wx.navigateTo({
      url: '../templateSelect/template?masks='+JSON.stringify(me.data.items),
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
