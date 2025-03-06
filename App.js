//import './App.css'; idk if Ill need this later, it came with the npm create-react-app command
const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();

//loading pokemon data from API
let validPokemonSet = new Set();
async function loadAllPokemonNames() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=1400";

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }


    const data = await res.json();
    data.results.forEach((p) => validPokemonSet.add(p.name));

    url = data.next;
  }
  console.log(`Loaded ${validPokemonSet.size} pokemons from PokeAPI.`);


}



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


loadAllPokemonNames()
  .then(() => {
    app.locals.validPokemonSet = (validPokemonSet); //KEEPING THIS HERE FOR SERVER
    app.locals.validPokemonArray = JSON.stringify(Array.from(validPokemonSet)); //AND THIS ONE FOR CLIENT

    console.log("Loaded all pokemon names, server starting...");

    
    //app.locals.validPokemonSet = validPokemonSet;

    app.listen(3001, () => {
      console.log('Server is running on Port 3001');
    });
  })

  .catch((err) => {
    console.error("Couldnt load pokemon data:", err);
    process.exit(1);
  });
