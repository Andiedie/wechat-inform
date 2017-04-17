require('thunk-mocha')();
const nock = require('nock');
const assert = require('assert');

const info = {
  appid: '',
  appsecret: '',
  template_id: ''
};
const wi = require('../index')(info);

describe('测试号信息', function () {
  it('appid', function () {
    assert(typeof info.appid === 'string');
    assert(info.appid.length > 0);
  });
  it('appsecret', function () {
    assert(typeof info.appsecret === 'string');
    assert(info.appsecret.length > 0);
  });
  it('template_id', function () {
    assert(typeof info.template_id === 'string');
    assert(info.template_id.length > 0);
  });
});

describe('access_token测试', function () {
  let at;
  it('测试过期自动重置', async function () {
    nock.disableNetConnect();
    nock('https://api.weixin.qq.com')
      .get('/cgi-bin/token')
      .query(true)
      .reply(200, {
        access_token: 'access_token 1',
        expires_in: 0
      });
    let at1 = await wi.getAccessToken(true);
    nock('https://api.weixin.qq.com')
      .get('/cgi-bin/token')
      .query(true)
      .reply(200, {
        access_token: 'access_token 2',
        expires_in: 0
      });
    let at2 = await wi.getAccessToken();
    assert(at1 !== at2);
    nock.enableNetConnect();
    nock.cleanAll();
  });

  it('获取access_token', async function () {
    at = await wi.getAccessToken();
    assert(typeof at === 'string');
  });

  it('重复获取access_token', async function () {
    let _at = await wi.getAccessToken();
    assert(_at === at);
  });

  after(function () {
    nock.enableNetConnect();
    nock.cleanAll();
  });
});

describe('功能测试', function () {
  it('获取用户列表', async function () {
    let list = await wi.getUserList();
    assert(list.length >= 0);
  });

  it('测试发送模板消息', async function () {
    await wi.send();
  });
});
