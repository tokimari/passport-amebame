"use strict";

/**
 * `AmebameNotRegisteredError`
 *
 * @constructor
 * @param {String} [message]
 * @param {Object|Error} [err]
 * @api public
 */
function AmebameNotRegisteredError(message, err) {
  Error.call(this);
  this.name = 'AmebameNotRegisteredError';
  this.message = message;
  this.oauthError = err;
}

/**
 * Inherit from `Error`.
 */
AmebameNotRegisteredError.prototype.__proto__ = Error.prototype;

/**
 * Returns a string representing the error.
 *
 * @return {String}
 * @api public
 */
AmebameNotRegisteredError.prototype.toString = function() {
  var m = this.name;
  if (this.message) { m += ': ' + this.message; }
  if (this.oauthError) {
    if (this.oauthError instanceof Error) {
      m = this.oauthError.toString();
    } else if (this.oauthError.statusCode && this.oauthError.data) {
      m += ' (status: ' + this.oauthError.statusCode + ' data: ' + this.oauthError.data + ')';
    }
  }
  return m;
};


/**
 * Expose `AmebameNotRegisteredError`.
 */
module.exports = AmebameNotRegisteredError;
