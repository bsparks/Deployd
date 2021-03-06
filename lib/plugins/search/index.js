var app = require('../../app')
  , Collection = require('../../collection')
;


app.all('/search/:type?', function(req, res) {
  var c = Collection.spawn().for(req)
    , find = req.param('find')
    , select = req.param('select')
    , type = req.param('type')
    , query
    , parserError
  ;
  
  if((find || req.body) && type) {
    c.collection = type;
    try {
      c.query = find ? JSON.parse(find) : req.body;
      if(select) {
        c.select = JSON.parse(select);
      }
      if(sort) {
        c.sort = JSON.parse(sort);
      }
    } catch(e) {
      parserError = e;
    }
    
    if(!c.query) {
        c.error('Encounted an error while parsing find JSON', 'Query');
        res.send(m.toJSON());
        return;
    }
  } else {
    c.error('You must include both find and type parameters to perform a query.', 'Query');
  }
  
  // wrap the json in a results object
  c.wrap = 'results';
  
  // fetch the results and notifty the 
  // response with results when done
  c.notify(res).fetch();
});