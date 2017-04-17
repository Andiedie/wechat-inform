require('thunk-mocha')();
const nock = require('nock');

const wi = require('../index')({
  appid: 'wx7961cd460b3edc18',
  appsecret: '7c66149af5868a663e046f6bf56d2a62'
});
const assert = require('assert');

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
    await wi.send({
      template_id: 'b6USTY4-2hw8yg9HFWWvU0x_kloUsfO8oUSCKNyJUuI',
      data: {
        param: {
          value: '参数Param',
          color: '#2f9833'
        }
      }
    });
  });
});
