"use strict";
var util = require("util");
var passport = require("passport-strategy");
var debug = require("debug")("passport-weapp");
var OAuth = require("wechat-oauth-ts");

function WeAppStrategy(options, verify) {
  options = options || {};

  if (!verify) {
    throw new TypeError("WeAppStrategy required a verify callback");
  }

  if (typeof verify !== "function") {
    throw new TypeError("_verify must be function");
  }

  if (!options.appID) {
    throw new TypeError("WeAppStrategy requires a appID option");
  }

  if (!options.appSecret) {
    throw new TypeError("WeAppStrategy requires a appSecret option");
  }

  passport.Strategy.call(this, options, verify);

  this.name = options.name || "weapp";
  this._client = options.client || "weapp";
  this._verify = verify;
  this._oauth = new OAuth(
    options.appID,
    options.appSecret,
    options.saveToken,
    options.getToken
  );
  this._scope = options.scope || "snsapi_userinfo";
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from 'passort.Strategy'
 */
util.inherits(WeAppStrategy, passport.Strategy);

WeAppStrategy.prototype.authenticate = function(req, options) {
  if (!req._passport) {
    return this.error(new Error("passport.initialize() middleware not in use"));
  }

  var self = this;

  options = options || {};

  // 获取code,并校验相关参数的合法性
  // No code only state --> User has rejected send details. (Fail authentication request).
  if (req.query && req.query.state && !req.query.code) {
    return self.fail(401);
  }

  // Documentation states that if user rejects userinfo only state will be sent without code
  // In reality code equals "authdeny". Handle this case like the case above. (Fail authentication request).
  if (req.query && req.query.code === "authdeny") {
    return self.fail(401);
  }

  // 获取code授权成功
  if (req.query && req.query.code) {
    var code = req.query.code;
    debug("wechat callback -> \n %s", req.url);

    self._oauth
      .code2Session(code)
      .then(function(response) {
        // 校验完成信息
        function verified(err, user, info) {
          if (err) {
            return self.error(err);
          }
          if (!user) {
            return self.fail(info);
          }
          self.success(user, info);
        }

        debug(
          "fetch code2Session -> \n %s",
          JSON.stringify(response, null, " ")
        );

        var profile = {
          openid: response["openid"],
          unionid: response["unionid"]
        };

        try {
          if (self._passReqToCallback) {
            self._verify(
              req,
              response["access_token"],
              response["refresh_token"],
              profile,
              response["expires_in"],
              verified
            );
          } else {
            self._verify(
              response["access_token"],
              response["refresh_token"],
              profile,
              response["expires_in"],
              verified
            );
          }
        } catch (ex) {
          return self.error(ex);
        }
      })
      .catch(function(err) {
        return self.error(err);
      })
      .finally(function() {});
  } else {
    self.fail("缺少 code", 401);
  }
};

module.exports = WeAppStrategy;
