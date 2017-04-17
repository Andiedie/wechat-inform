# wechat-inform
利用[微信测试号](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)进行自定义消息的通知

![](http://ocphk5wc7.bkt.clouddn.com//17-4-17/7374817-file_1492411163767_8fe4.png)

# 使用
## 1. 安装
```bash
npm i -S wechat-inform
```

## 2. 基本使用
```javascript
const wi = require('wechat-inform')(
  appid: 'YOUR_APPID',
  appsecret: 'YOUR_APPSECRET',
  template_id: 'TEMPLATE_ID'
);

wi.send();
```
运行以上代码即可向测试号的**所有关注者**发送`template_id`的内容

# API
## initial
初始化模块需要提供测试号的`appid`, `appsecret`

```javascript
const wi = require('wechat-inform')(
  appid: 'YOUR_APPID',
  appsecret: 'YOUR_APPSECRET'
);
```

`template_id`是可选的, 作为发送模板消息时的默认值.
```javascript
const wi = require('wechat-inform')(
  appid: 'YOUR_APPID',
  appsecret: 'YOUR_APPSECRET',
  template_id: 'TEMPLATE_ID'
);
```

## wi.send(option)
向关注测试号的**所有用户**发送模板消息

- `option.template_id <string>` default=初始化时的`template_id`
  模板需要在测试号页面手动添加
- `option.url <string>`
  用户点击模板消息时跳转的链接
- `option.data`
  定义模板中参数的值和颜色

```javascript
wi.send({
  template_id: 'TEMPLATE ID',
  url: 'http://example.com',
  data: {
    param1: {
      value: '参数名为param1的值'
      color: '#e6db74'
    },
    param2: {
      value: '参数名为param2的值'
    }
  }
});
```

## wi.getAccessToken(force)
获取测试号的`access_token`

- `force <boolean>` default =`false`
	是否强制更新
- Returns: `<Promise <access_token>>`

`access_token`可用于调用微信的其他测试号API, 有效时间为两个小时. 模块会自动在失效时更新, 确保通过此方法拿到的`access_token`是可用的.

```javascript
wi.getAccessToken()
  .then(access_token => {
	// do something.
  });

// or in async function
let access_token = await wi.getAccessToken();
```

## wi.getUserList()
获取关注测试号的用户列表

- Returns: `<Promise <Array>>`

```javascript
wi.getUserList()
  .then(userList => {
    for (let user of userList) {
      // do something
    }
  });

// or in async function
let userList = await wi.getUserList();
```

# 如何获取测试号
## 1.1. 申请测试号
点击[申请测试号](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)

![](http://ocphk5wc7.bkt.clouddn.com//17-4-17/9080796-file_1492411324087_8049.png)

**登陆后扫描二维码关注自己的测试号**

## 2. 添加模板

![](http://ocphk5wc7.bkt.clouddn.com//17-4-17/98970177-file_1492411517372_3c87.png)


模板可以指定任何内容

使用如下语法指定参数内容

```javascript
{{参数名.DATA}}

// 例如

用户{{name.DATA}}, 你好
...内容...
```

## 3. 获取帐号信息
记录测试服务号的`appID`, `appsecret`和新增模板的`template_id`

![](http://ocphk5wc7.bkt.clouddn.com//17-4-17/23191494-file_1492411712971_6205.png)

![](http://ocphk5wc7.bkt.clouddn.com//17-4-17/65530764-file_1492411755952_677a.png)
