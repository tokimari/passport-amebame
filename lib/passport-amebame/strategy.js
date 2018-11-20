"use strict";

/**
 * Module dependencies
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , AmebameNotRegisteredError = require('./error/amebame_not_registered_error');

/**
 * `Strategy` constructor.
 *
 * Options:
 *   - `clientID`         your ameba application's client id.
 *   - `clientSecret`     your ameba application's client secret.
 *   - `scope`            your application's scope
 *   - `sandbox`          If you want to use in the sandbox environment, and then to `true`
 *   - `customBaseUrl`    If you want to use custom base url, set it in this option
 *   - `customBaseAPIUrl` If you want to use custom API base url, set it in this option
 *
 * @param {Object}   options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  options.scope = options.scope || 'profile,application,connection,photo,coin';
  if (options.customBaseUrl) {
    options.baseUrl = options.customBaseUrl;
  } else {
    options.baseUrl = options.sandbox ? 'https://sb.dauth.user.ameba.jp' : 'https://dauth.user.ameba.jp';
  }
  if (options.customBaseAPIUrl) {
    options.baseApiUrl = options.customBaseAPIUrl;
  } else {
    options.baseApiUrl = options.sandbox ? 'https://api.sb-amebame.com' : 'https://api.amebame.com';
  }
  options.authorizationURL = options.baseUrl + '/authorize';
  options.tokenURL = options.baseUrl + '/token';

  OAuth2Strategy.call(this, options, verify);

  this._baseApiUrl = options.baseApiUrl;
  this._baseApiHttpUrl = this._baseApiUrl.replace(/^https/, 'http');
  this._profileUrl = options.baseApiUrl + "/graph/me";

  //
  // custom use header
  //   Authorization: OAuth {AccessToken}_{ClientId}
  //
  this._oauth2.useAuthorizationHeaderforGET(true);
  this._oauth2.setAuthMethod('OAuth');
  this._oauth2.buildAuthHeader = function(token) {
    return this._authMethod + ' ' + token + '_' + this._clientId;
  };

  this.name = 'amebame';
}

util.inherits(Strategy, OAuth2Strategy);

/**
 * Authenticate request by delegating to a service provider using OAuth 2.0.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  options._req = options.req || req;

  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

/**
 * Return extra parameters to be included in the authorization request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
  var params = options || {};

  if (params._req) {
    var query = params._req.query;

    if (query.frm_id) {
      params.frm_id = query.frm_id;
    }
    if (query.ameba_frm_id) {
      params.ameba_frmId = query.ameba_frm_id;
    }
    if (query.provider_id) {
      params.provider_id = query.provider_id;
    }
    if (query.state) {
      params.state = query.state;
    }
    if (query.redirect_uri) {
      params.redirect_uri = query.redirect_uri;
    }
    if (query.force_provider) {
      params.force_provider = query.force_provider;
    }
    if (query.response_type) {
      params.response_type = query.response_type;
    }
    if (query.display) {
      params.display = query.display;
    }
    delete params._req;
  }

  return params;
};

Strategy.prototype.userProfile = function (accessToken, done) {
  var self = this;
  this._oauth2.get(this._profileUrl, accessToken, function (err, body) {
    if (err) {
      // if status code is 401, then you should redirect to amebame's register page.
      if (err.StatusCode === 401 && JSON.parse(err.data).error_description === 'auth.notRegistered') {
        return done(new AmebameNotRegisteredError('failed unregistered user', err));
      } else {
        return done(new InternalOAuthError('failed to fetch user profile', err));
      }
    }
    try {
      var json = JSON.parse(body);
      var profile = { provider: 'amebame' };
      profile.id = json.id;
      profile.displayName = json.name;
      profile.imageUrl = self._baseApiHttpUrl + "/graph/" + profile.id + "/picture";
      profile.gender = json.gender;
      profile.birthday = json.birthday;

      profile._raw = body;
      profile._json = json;
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};


/**
 * Expose Storategy
 */
module.exports = Strategy;
