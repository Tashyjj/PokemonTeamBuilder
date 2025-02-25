//import './App.css'; idk if Ill need this later, it came with the npm create-react-app command
const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

const teamController = require('./controllers/teamController');

app.get('/', teamController.home);
app.get('/teams', teamController.listTeams);
app.get('teams/:id', teamController.viewTeam);
//Ill add routes here for creating and delting / editing teams

app.listen(3001, () => {
  console.log('Server is running on Port 3001');
});
