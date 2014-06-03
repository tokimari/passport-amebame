'use strict';

module.exports = {

  /**
   * redirect to register page
   *
   * options
   *   - clientID your amebame application's client id.
   *   - registerCallbackURL redirect url after registered
   *
   * @param options {Object}
   */
  'redirectRegisterPage': function(options) {
    if (!options.clientID) {
      throw new Error('AmebameService requires a clientID');
    }

    var registerCallbackURL = options.registerCallbackURL ? options.registerCallbackURL : '';

    options = options || {};

    options.registerURL = options.sandbox ? 'https://s.sb-amebame.com/#register?callback=' : 'https://s.amebame.com/#register?callback=';
    options.registerURL += registerCallbackURL + '&client_id=' + options.clientID;
    
    // TODO: PC版の場合,redirect先を変えるようにする
    options.registerPcURL = 'https://accounts.user.ameba.jp/accounts/d/registration/inform?callback=' +
                            registerCallbackURL +
                            '&client_id='   +
                            options.clientID;

    return function(req, res) {
      res.redirect(options.registerURL);
    };
  }
};
