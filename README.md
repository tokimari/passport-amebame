# passport-amebame


[Passport](http://passportjs.org/) strategy for authenticating with Amebame using the OAuth 2.0 API.


## install

```
$ npm install passport-amebame
```

## 使い方

### Configure Strategy

```
passport.use(new AmebameStrategy({
    siteURL: "http://localhost/",
    clientID: AMEBAME_CLIENT_ID,
    clientSecret: AMEBAME_CLIENT_SECRET,
    scope: scope,
    sandbox: true
  },
  function(accessToken, refreshToken, params, profile, done) {
    User.findOrCreate({amebameId: profile.id, as_id: params.as_id}, function(err, user) {
      return done(err, user);
    });
  }
));
```

### Authenticate Request


```
app.get('/auth/amebame',
  passport.authenticate('amebame'));

// 認可が完了していない場合,自分でredirect先を設定する必要がある

var registerRedirect = AmebameService.redirectRegisterPage({clientID: clientId, registerCallbackURL: "http://localhost"})

app.get('/auth/amebame/callback',
    function(req, res, next) {
      passport.authenticate('amebame', function(err, user, info) {
        if (err && err.name === 'AmebameNotRegisteredError') {
          registerRedirect(req, res);
        } else {
          if (err) {
            res.redirect("/error");
          } else {
            req.login(user, {session: true}, function() {
              res.redirect('/');
            });
          }
        }
      })(req, res, next);
    });
```

