const axios = require('axios');
const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
let appid, appsecret, accessToke, timeoutId;
let expire = 0;

async function getAccessToken () {
  clearTimeout(timeoutId);
  let {data} = await axios.get(tokenUrl, {
    params: {
      grant_type: 'client_credential',
      appid: appid,
      secret: appsecret
    }
  });
  accessToke = data.access_token;
  expire = new Date().getTime() + data.expires_in * 900;
}

module.exports = function (option) {
  ({appid, appsecret} = option);
  return async function (force = false) {
    if (force || new Date().getTime() >= expire) {
      await getAccessToken();
    }
    return accessToke;
  };
};
