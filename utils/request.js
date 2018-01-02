
var baseUrl = 'http://172.19.11.51:8080/word_image'
// var baseUrl = 'https://wnews.mjmobi.com/word_image'///cal24/play'

var openIdUrl = baseUrl + '/get_openid'   //get

var updateUserUrl = baseUrl + '/update_user_info' //post

var imageTaskUrl = baseUrl + '/image_task'  //post

var getImagerUrl = baseUrl + '/get_image' //get

var getTextUrl = baseUrl + '/get_text' //get

var getMaskUrl = baseUrl + '/get_mask' //get

var shareUrl = baseUrl + '/share' //get

/**
 * 
 * 获取openID
 * req: appid, js_code, grant_type, inviter_id(openid)
 * resp: openid, session_code, errcode, errmsg
 */
function getOpenId(param, succes, fail) {
  _getWithParam(openIdUrl, param, succes, fail)

}

/**
 * req: nickName, avatarUrl, gender, city, province, country, language, openid, session_code
    resp: errcode
 */
function update_user_info(data, success, fail) {
  _post(updateUserUrl, data, success, fail)
}

/**
req: openid, session_code, mask, font, colors, text
resp: errcode, errmsg, image_id
 * 
 */
function image_task(param, success, fail) {
  _getWithParam(imageTaskUrl, param, success, fail)
}

/**
 * 
req: openid, session_code, task_id
resp: errcode, errmsg, image_url
 */
function get_image(data, success, fail) {
  _post(getImagerUrl, data, success, fail)
}

/**
req: none
resp: {text: {tag: [{id, text}]}}
 */
function get_text(param, success, fail) {
  _getWithParam(getTextUrl, param, success, fail)
}

/**
 * req: none
resp: {masks: [{id, name, url}]}
 */
function get_mask(param, success, fail) {
  _getWithParam(getMaskUrl, param, success, fail)
}

/**
 * req: {openid}
 * resp: 200 or 404
 */
function share(openid) {
  var param = {
    openid: openid
  }
  _getWithParam(shareUrl, param, function (s) {
    console.log("分享上报成功")
  }, function (f) { })
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _get(url, s, f) {
  console.log(url, "------start---_get----");
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: "GET",
    success: function (res) {
      console.log("data", res.data)
      if (res.statusCode == 200) {
        s(res.data);
      } else {
        f(res)
      }
    },
    fail: function (res) {
      console.log(res)
      f(res);
    }
  });
  // console.log(url, "----end-----_get----");
}

function _getWithParam(url, data, s, f) {
  console.log(url, data, "------start---_get----");
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: "GET",
    data: data,
    success: function (res) {
      console.log("data", res.data)
      if (res.statusCode == 200) {
        s(res.data);
      } else {
        f(res)
      }
    },
    fail: function (res) {
      console.log(res)
      f(res);
    }
  });
  // console.log(url, "----end-----_get----");
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _post(url, data, s, f) {
  console.log(url, data, "----_post--start-------");
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: 'POST',
    data: data,
    success: function (res) {
      console.log("data", res.data)
      if (res.statusCode == 200) {
        s(res.data);
      } else {
        f(res)
      }
    },
    fail: function (res) {
      console.log(res)
      f(res);
    }
  });
  // console.log(url, "----end-----_post----");
}

module.exports = {
  getOpenId: getOpenId,
  updateUser: update_user_info,
  share: share,
  getMask: get_mask,
  getLabel: get_text,
  getImage: get_image,
  imageTask: image_task,

  // wxPromisify: wxPromisify,
  // wxLogin: wxLogin,
  // wxGetUserInfo: wxGetUserInfo,
  // wxGetSystemInfo: wxGetSystemInfo
}