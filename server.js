const express = require('express'),
      app = express(),
      path = require('path'),
      port = process.env.PORT || 8000,
      bodyParser = require('body-parser');

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

app.listen(port, (err) => {
  if (err) {
   return console.log(`something bad happened ${err}`);
 }
 console.log(`server is listening on ${port}`);
});
