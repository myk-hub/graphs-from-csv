const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(express.static(`${__dirname}/public`));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

app.post('/upload', function(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  let sampleFile = req.files.sampleFile;

  sampleFile.mv('./public/upload/session_history.csv', (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.sendFile(path.join(`${__dirname}/public/charts.html`));
  });
});

app.listen(port, (err) => {
  if (err) {
   return console.log(`something bad happened ${err}`);
 }
 console.log(`server is listening on ${port}`);
});
