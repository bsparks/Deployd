var app = require('../../app')
  , Group = require('./group')
  , Groups = require('./groups')
  , User = require('./user')
  , Users = require('./users')
  , ObjectID = require('mongodb').BSON
;

function user(action, params, req, res) {
  User
    .spawn()
    .for(req)
    .set(params)
    .notify(res)
    [action]()
  ;
}

app.post('/users', function(req, res) {
  user('save', req.body, req, res);
});

app.post('/users/login', function(req, res) {
  user('login', req.body, req, {
    send: function(u) {
      u.auth = req.sessionID;
      res.send(req.session.user = u);
    }
  });
});

app.get('/users/logout', function(req, res) {
  req.session.destroy(function() {
    res.send({auth: null});
  });
});

app.get('/me', function(req, res) {
  user('fetch', {email: req.session.user && req.session.user.email}, req, res);
});

app.del('/me', function(req, res) {
  var u = req.session.user;
  if(u) user('remove', u, req, res);
});

app.get('/users/:id', function(req, res) {
  User
    .spawn()
    .for(req)
    .find({_id: req.param('id')})
    .notify(res)
    .fetch()
  ;
});

app.post('/users/:email/group', function(req, res) {
  var changes = {}
    , group = req.body && req.body.group
  ;
  
  // TODO validate group
  changes['groups.' + group] = 1;
  User
    .spawn()
    .for(req)
    .find({email: req.param('email')})
    .set({$set: changes})
    .notify(res)
    .save()
  ;
});

app.get('/users', function(req, res) {
  Users
    .spawn({
      query: req.params
    })
    .for(req)
    .notify(res)
    .fetch()
  ;
});
