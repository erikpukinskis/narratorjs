var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/narrator.html');
});

var server = app.listen((process.env.PORT || 3100), function() {
    console.log('Listening on port %d', server.address().port);
});