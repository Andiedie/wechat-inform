const axios = require('axios');
const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
let appid, appsecret, accessToke;

async function getAccessToken () {
  accessToke = null;
  let {data} = await axios.get(tokenUrl, {
    params: {
      grant_type: 'client_credential',
      appid: appid,
      secret: appsecret
    }
  });
  accessToke = data.access_token;
  setTimeout(getAccessToken, data.expires_in * 900);
}

module.exports = function (option) {
  ({appid, appsecret} = option);
  return async function () {
    if (!accessToke) {
      await getAccessToken();
    }
    return accessToke;
  };
};
