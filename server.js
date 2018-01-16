const express = require('express'),
      app = express(),
      path = require('path'),
      port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app.listen(port, (err) => {
  if (err) {
   return console.log(`something bad happened ${err}`);
 }

 console.log(`server is listening on ${port}`);
});
