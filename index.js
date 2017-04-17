const assert = require('assert');
const axios = require('axios');
const userListUrl = 'https://api.weixin.qq.com/cgi-bin/user/get';
const sendUrl = 'https://api.weixin.qq.com/cgi-bin/message/template/send';

module.exports = function (option) {
  assert.strictEqual(typeof option.appid, 'string', 'appid is required and must be a string');
  assert.strictEqual(typeof option.appsecret, 'string', 'appsecret is required and must be a string');
  const atg = require('./lib/access-token-getter')(option);
  let wi = {};
  wi.getAccessToken = atg;

  wi.getUserList = async function () {
    let {data: {openid}} = await axios.get(userListUrl, {
      params: {
        access_token: await wi.getAccessToken()
      }
    });
    return openid;
  };

  // @param template_id url data {}
  wi.send = async function (sendOption) {
    sendOption.template_id = sendOption.template_id || option.template_id;
    assert.strictEqual(typeof sendOption.template_id, 'string', 'template_id is required and must be a string');
    // let userList = await wi.getUserList();
    let {data} = await axios.post(sendUrl, sendOption, {
      params: {
        access_token: await wi.getAccessToken()
      }
    });
    if (data.errcode !== 0) {
      throw new Error(data.errmsg);
    }
  };
  return wi;
};
