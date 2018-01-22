// pages/templateSelect/template.js
var req = require( "../../utils/request.js");
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
    text_id:0,
    text:'',
    mask_id:0
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
          this.setData({
            selectedOne : item
          })
        } else if (item.isChecked) {//去除选中样式
          var changed = {};
          changed['templates[' + i + '][' + j + '].isChecked'] = false;
          this.setData(changed);
        }
      }
    }
  },

  
  submit: function(e){
    var me = this
    wx.navigateTo({
      url: '../result/result?text=' + this.data.text + "&mask_id=" + me.data.selectedOne.id + "&text_id=" + me.data.text_id + "&mask=" + me.data.selectedOne.img+"&tag="+me.data.tag,
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
    var arr = JSON.parse(options.masks)
    var masks = []
    masks.push(arr[0])
    // masks.push(arr[0])
    // masks.push(arr[0])
    
    var text_id = options.text_id
    var text = options.text
    var tag = options.tag
    var group=[]
    let imageSize = masks.length
    if (imageSize > 0) {
      let ll = Math.floor(imageSize >= 2 && imageSize % 2 == 0 ? imageSize / 2 : imageSize / 2 + 1)
      for (let j = 0; j < ll; j++) {
        group.push([])
      }
      for (let i = 0; i < imageSize; i++) {
        var tmp = masks[i]
        var img = req.url + tmp.url.replace("//", "/")
        group[Math.floor(i / 2)].push({
          // id: i,
          id: tmp.id,
          name: tmp.name,
          img: img,
          key: tmp.name,
          isChecked: i==0,
          localPath:''
        })
      }

      this.setData({
        templates:group,
        text:text,
        text_id:text_id,
        tag:tag,
        selectedOne:group[0][0]
      })
    }
    console.log("onload" ,text_id,text, group,arr,masks)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})