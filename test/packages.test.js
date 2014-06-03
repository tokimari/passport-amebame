"use strict";

var vows = require('vows');
var assert = require('assert');
var strategy = require('..');

vows.describe('passport-amebame').addBatch({
  'should export Strategy constructor': function() {
    assert.typeOf(strategy.Strategy, 'function');
  },
  'should export Service Object': function() {
    assert.typeOf(strategy.Service, 'object');
  }
}).export(module);
