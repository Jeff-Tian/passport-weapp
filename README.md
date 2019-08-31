# passport-weapp

> Passport for 微信小程序

[![npm download][download-image]][download-url]
[![NPM version](https://badge.fury.io/js/passport-weapp.png)](http://badge.fury.io/js/passport-weapp)
[![Build Status](https://travis-ci.com/Jeff-Tian/passport-weapp.svg?branch=master)](https://travis-ci.com/Jeff-Tian/passport-weapp)
[![Dependencies Status](https://david-dm.org/Jeff-Tian/passport-weapp.png)](https://david-dm.org/jeff-tian/passport-weapp)
[![Coverage Status](https://coveralls.io/repos/github/Jeff-Tian/passport-weapp/badge.svg?branch=master)](https://coveralls.io/github/Jeff-Tian/passport-weapp?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/Jeff-Tian/passport-weapp)
[![Git commit with emojis!](https://img.shields.io/badge/gitmoji-git%20commit%20with%20emojis!-brightgreen.svg)](https://gitmoji.js.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[download-image]: https://img.shields.io/npm/dm/passport-weapp.svg?style=flat-square
[download-url]: https://npmjs.org/package/passport-weapp

[Passport](http://passportjs.org/) strategy for authenticating with [Wechat Mini Program](http://weixin.qq.com/)

## 示例

|                                        微信小程序                                         |                                            微信小程序体验版                                             |
| :---------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
| ![Hardway](https://github.com/Jeff-Tian/me/raw/master/src/images/gh_e56e6784a430_258.jpg) | ![Hardway Demo](https://github.com/Jeff-Tian/me/raw/master/src/images/odrHN4lVhrjiktR18jU8Hn1Z2chY.jpg) |

## 支持功能

- 微信小程序登录

## 安装

    $ npm install passport-weapp

## 使用

#### Configure Strategy

```js
 passport.use(new WeappStrategy({
        appID: {APPID},
        name:{默认为wechat,可以设置组件的名字}
        appSecret: {APPSECRET},
        getToken: {getToken},
        saveToken: {saveToken}
      },
      function(accessToken, refreshToken, profile,expires_in, done) {
        return done(err,profile);
      }
));

The `getToken` and `saveToken` can be provided to initialize Wechat OAuth instance.
```

#### Authenticate Requests

```js
router.get("/auth/weapp", passport.authenticate("weapp", options));
```

`options` - Optional. Can include the following:

- `state` - Override state for this specific API call
- `callbackURL` - Override callbackURL for this specific API call
- `scope` - Override scope for this specific API call

If no callbackURL is specified, the same request url will be used.

## License

Copyright (c) 2019 jeff-tian  
Licensed under the MIT license.
