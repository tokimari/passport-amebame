'use strict';

/**
 * Module dependencies
 */
var Strategy = require('./strategy');

/**
 * Service Module
 */
var Service = require('./service');

/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors
 */
exports.Strategy = Strategy;
exports.Service = Service;
