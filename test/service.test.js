"use strict";

var vows = require('vows')
  , assert = require('assert')
  , sinon = require('sinon')
  , AmebameService = require('passport-amebame/service');

vows.describe('AmebameService').addBatch({
  "service": {
    "production": {
      topic: function () {
        var callback = AmebameService.redirectRegisterPage({
          clientID: "clientID",
          registerCallbackURL: "http://example.jp/"
        });
        var res = {};
        res.redirect = sinon.spy();
        callback({}, res);
        return res;
      },
      "should redirect registerURL": function(res) {
        var url = 'https://s.amebame.com/#register?callback=http://example.jp/&client_id=clientID';
        assert.isTrue(res.redirect.calledWith(url));
      }
    },
    "sandbox": {
      topic: function () {
        var callback = AmebameService.redirectRegisterPage({
          clientID: "clientID",
          registerCallbackURL: "http://example.jp/",
          sandbox: true
        });
        var res = {};
        res.redirect = sinon.spy();
        callback({}, res);
        return res;
      },
      "should redirect registerURL": function(res) {
        var url = 'https://s.sb-amebame.com/#register?callback=http://example.jp/&client_id=clientID';
        assert.isTrue(res.redirect.calledWith(url));
      }
    }
  }
}).export(module);
