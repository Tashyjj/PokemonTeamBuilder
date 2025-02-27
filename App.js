//import './App.css'; idk if Ill need this later, it came with the npm create-react-app command
const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();

app.engine('mustache', mustacheExpress(__dirname + '/views/partials'));
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function (res, filePath) {
    if (filePath.endsWith('.woff2')) {
      res.set('Content-Type', 'font/woff2');
    }else if (filePath.endsWith('.ttf')) {
      res.set('Content-Type', 'font/ttf');
    }
  }
}));
app.use(express.urlencoded({ extended: false }));

const teamController = require('./controllers/teamController');
app.use("/", teamController);

app.listen(3001, () => {
  console.log('Server is running on Port 3001');
});