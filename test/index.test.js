require('thunk-mocha')();

const wi = require('../index')({
  appid: 'wx7961cd460b3edc18',
  appsecret: '7c66149af5868a663e046f6bf56d2a62'
});
const assert = require('assert');

describe('微信通知测试', function () {
  let at;
  it('获取access_token', async function () {
    at = await wi.getAccessToken();
    assert(typeof at === 'string');
  });

  it('重复获取access_token', async function () {
    let _at = await wi.getAccessToken();
    assert(_at === at);
  });
});
