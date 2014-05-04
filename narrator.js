var express = require('express');
var app = express();

app.set('views', __dirname + '/public');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/foreward.html');
});

var server = app.listen((process.env.PORT || 3100), function() {
    console.log('Listening on port %d', server.address().port);
});