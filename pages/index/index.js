//index.js
//获取应用实例
const app = getApp()
var req = require("../../utils/request.js")
const defLabels = [{ lid: -1, name: "减肥", id: "r0", checked: "true" }, { lid: -2, name: "热词", id: "r1" }, { lid: -3, name: "励志", id: "r2" }, { lid: -4, name: "个性", id: "r3" }]// { name: "个性", id: "r6" }, { name: "个性", id: "r4" }],
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    labels: defLabels,
    currentPage: { id: "r0", name: "减肥" },
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    // currPage: 0,
    masks: [],
    allItems: [],
    curTag: '减肥',
    text_id: 1,
    text: ''
  },

  onLoad: function () {
    app.globalData.labels = defLabels //切换到我的页面备用
    var that = this

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
    //默认页面
    var items = []
    while (items.length < 5) {
      items.push({
        id: -1,
        tag: "减肥",
        content: '',
        isTouchMove: false, //默认全隐藏删除
        isNull: true
      })
    }
    that.setData({
      items: items
    })
    that.getDataFromServer()

    wx.getStorageInfo({
      success: function (res) {
        // console.log(res.keys)
        console.log("已使用空间：", res.currentSize)
        console.log("存储限制：", res.limitSize)
        if (res.currentSize > res.limitSize * 0.8) {
          try {
            wx.clearStorageSync()

          } catch (e) {

          }
        }
      },
    })
  },

  //tab切换
  tabClick: function (e) {
    var me = this;
    if (me.checkData()) {
      me.getDataFromServer()
      return
    }
    var v = e.detail.value
    for (let i = 0; i < me.data.labels.length; i++) {
      if (v == me.data.labels[i].id) {
        var indexTag = me.data.labels[i]
        var curTag = me.data.labels[i].name
        me.initCurrentData(curTag)
        break
      }
    }

    me.setData({
      currentPage: indexTag,
      // currPage: index,
      curTag: curTag
    })
  },
  //换一批
  refresh() {
    console.log("换一批")
    var me = this
    if (me.checkData()) {
      me.getDataFromServer()
    } else {
      me.initCurrentData(me.data.curTag)
    }
  },

  checkData() {
    return this.data.allItems == null || this.data.allItems.length == 0
  },

  //获取标签，模板信息
  getDataFromServer() {
    var that = this
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    req.getCYSetting(
      res => {
        // console.log(res)
        wx.hideLoading()
        that.setData({
          masks: res.mask
        })
        that.doTemp(res.text)
      }, fail => {
        wx.hideLoading()
        console.error("setting error", fail)
        wx.showToast({
          title: '服务器异常',
        })
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
      currentPage = { id: 'r0', name: '减肥' },
      that = this,
      all = [],
      labels = [],
      items = [],
      tmp;

    // text = [
    //   {
    //     id: 1,
    //     tag: "减肥",
    //     text: "不瘦十斤，不换头像"
    //   }, {
    //     id: 1,
    //     tag: "减肥",
    //     text: "连体重都控制不了，何以控制人生？"
    //   }, {
    //     id: 1,
    //     tag: "减肥",
    //     text: "女人不对自己狠心，男人就会对自己死心。"
    //   }, {
    //     id: 1,
    //     tag: "减肥",
    //     text: "没有吃饱只有一个烦恼，吃饱了有无数烦恼"
    //   },
    //   {
    //     id: 1,
    //     tag: "减肥",
    //     text: "一个烦恼，吃饱了有无数烦恼"
    //   }, {
    //     id: 1,
    //     tag: "减肥",
    //     text: "没有一个烦恼，吃饱了有无数烦恼"
    //   }, {
    //     id: 1,
    //     tag: "减肥",
    //     text: "吃饱有一个烦恼，吃饱了有无数烦恼"
    //   }, {
    //     id: 1,
    //     tag: "减肥",
    //     text: "没有无数烦恼"
    //   }, {
    //     id: 2,
    //     tag: "热词",
    //     text: "吃饱了有无数烦恼"
    //   }, {
    //     id: 2,
    //     tag: "热词",
    //     text: "吃饱了有无数烦恼"
    //   }, {
    //     id: 2,
    //     tag: "热词",
    //     text: "吃饱了有无数烦恼"
    //   }, {
    //     id: 2,
    //     tag: "热词",
    //     text: "吃饱了有无数烦恼"
    //   }, {
    //     id: 2,
    //     tag: "热词",
    //     text: "吃饱了有无数烦恼"
    //   }, {
    //     id: 3,
    //     tag: "励志",
    //     text: "吃饱励志"
    //   }, {
    //     id: 4,
    //     tag: "个性",
    //     text: "没有个性"
    //   }
    //   // , {
    //   //   id: 5,
    //   //   tag: "拼搏",
    //   //   text: "没有个性"
    //   // }
    // ]
    for (let i = 0; i < text.length; i++) {
      tmp = text[i]
      all.push({
        id: tmp.id,
        tag: tmp.tag,
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
    // console.log(labels)
    // labels = that.unique(labels)
    labels = defLabels
    console.log("texts", all)
    console.log("labels", labels)
    currentPage = labels[0]
    that.data.allItems = all

    that.setData({
      // labels: labels,
      currentPage: currentPage,
      curTag: labels[0].name,
    })
    that.initCurrentData(labels[0].name)
  },

  initCurrentData(curTag) {
    if (!curTag) {
      console.log("current id", curTag)
      return
    }
    var
      that = this,
      all = that.data.allItems,
      items = [];
    for (let k = 0; k < all.length; k++) {
      let t = all[k]
      if (t.tag == curTag) {
        items.push(t)
      }
    }
    while (items.length < 5) {
      items.push({
        id: -1,
        tag: curTag,
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
        items.splice(oldIndex, 1)
      }
      items = radomItems
    }
    that.setData({
      items: items,
      text_id: items[0].id,
      text: items[0].content
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
    //不足四个标签，补齐4个
    // if (result.length < 4) {
    //     for(var j=0; j< defLabels.length;j++){
    //       var t = defLabels[j]
    //       for(var k=0; k< result.length;k++){
    //          result[k].name == t.name
    //       }
    //     }
    // }
    return result
  },

  // 制作头像
  createPhoto(e) {
    console.log("制作头像")
    // console.log(e.detail.formId)
    // var form = e.detail.formId
    // this.data.items[0].content = form
    // this.data.items[0].isNull = (form.length == 0)
    // this.setData({
    //   items: this.data.items
    // })
    var me = this
    if (!me.data.text) {
      wx.showToast({
        title: '请选择词句',
      })
      return
    }
    if (me.data.masks == null || me.data.masks.length == 0) {
      wx.showToast({
        title: '服务器异常',
      })
      return
    }
    wx.navigateTo({
      url: '../templateSelect/template?masks=' + JSON.stringify(me.data.masks) + "&text_id=" + me.data.text_id + "&text=" + me.data.text + "&tag=" + me.data.currentPage.name,
    })
  },

  editor(e) {
    console.log("修改内容", e.detail)
    var newValue = e.detail.value
    let index = Number(e.currentTarget.dataset.index)

    this.data.items[index].content = newValue
    this.data.items[index].isNull = (newValue.length == 0)
    // this.data.items[index].isTouchMove = (newValue.length == 0)
    this.setData({
      items: this.data.items,
      text: newValue
    })
  },

  selectItem(e) {
    let text_id = Number(e.currentTarget.dataset.id)
    let index = Number(e.currentTarget.dataset.index)
    let text = this.data.items[index].content
    console.log("tap item", text_id, index, text)
    this.setData({
      text_id: text_id,
      text: text
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
