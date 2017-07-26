const assert = require('assert');
const axios = require('axios');
const userListUrl = 'https://api.weixin.qq.com/cgi-bin/user/get';
const sendUrl = 'https://api.weixin.qq.com/cgi-bin/message/template/send';

module.exports = function (option) {
  assert(typeof option.appid === 'string' && option.appid, 'appid must be a non-empty string');
  assert(typeof option.appsecret === 'string' && option.appsecret, 'appsecret must be a non-empty string');
  let wi = {};
  wi.getAccessToken = require('./lib/access-token-getter')(option);

  wi.getUserList = async function () {
    let {data: {data: {openid}}} = await axios.get(userListUrl, {
      params: {
        access_token: await wi.getAccessToken()
      }
    });
    return openid;
  };

  wi.send = async function (sendOption = {}) {
    const template_id = sendOption.template_id || option.template_id;
    assert(typeof template_id === 'string' && template_id, 'template_id is required and must be a string');
    let userList = await wi.getUserList();
    let promises = [];
    for (let touser of userList) {
      promises.push(axios.post(sendUrl, {
        template_id,
        touser
      }, {
        params: {
          access_token: await wi.getAccessToken()
        }
      }));
    }
    await Promise.all(promises);
  };

  return wi;
};
