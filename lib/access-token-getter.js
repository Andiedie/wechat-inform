const axios = require('axios');
const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
let appid, secret, accessToke;
let expire = 0;

module.exports = function (option) {
  appid = option.appid;
  secret = option.appsecret;
  return async function (force = false) {
    if (force || new Date().getTime() >= expire) {
      try {
        let {data} = await axios.get(tokenUrl, {
          params: {
            grant_type: 'client_credential',
            appid,
            secret
          }
        });
        accessToke = data.access_token;
        if (!accessToke) throw new Error(data.errmsg);
        expire = new Date().getTime() + data.expires_in * 900;
      } catch (e) {
        throw new Error('Fail to get access_token: ' + e.message);
      }
    }
    return accessToke;
  };
};
