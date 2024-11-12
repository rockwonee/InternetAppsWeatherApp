const express = require('express')  // importing express
const axios = require('axios')      // importing axios
const app = express()
const PORT = 3000                   // setting PORT value
const path=require("path")

// setting a path to the client folder
let clientPath= path.resolve(__dirname, "../client")

app.use(express.static(clientPath))

// to parse JSON data
app.use(express.json()) 

// to access the vue html file and app
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'vue0.html'));
});

// openweathermap API Url and Key
const APIUrl1 = "https://api.openweathermap.org/data/2.5/forecast?q=";
const APIKey = "d085bf2d6112ab04eb5701c15be1f63b";
//const city = "Brussels";

// to get weather forecast
app.get('/data', async(req, res) => {
    // the city name is within the query
    const city = req.query.city;
    if(!city){
        return res.status(400).send("City name required");
    }
    try {
        const response = await axios.get(APIUrl1 + city + `&appid=${APIKey}`);
        res.json(response.data);
    }   catch (err) {
            console.error(err);
            res.status(400).send("ERROR: error with fetching data");
    }
});

// for getting the latitudes and longitudes
const APIUrl2 ="http://api.openweathermap.org/geo/1.0/direct?q=";

// to get the longitude and latitude values
app.get('/locations', async(req, res) => {
    const city = req.query.city;
    if(!city) {
        return res.status(400).send("City name required");
    } try {
        const response = await axios.get(APIUrl2+ city + `&appid=${APIKey}`);
        res.json(response.data);    
    }   catch (err) {
            console.error(err);
            res.status(400).send("ERROR: erorr fetching the data");
    }
});


const APIUrl3 ="http://api.openweathermap.org/data/2.5/air_pollution?";

// http://api.openweathermap.org/data/2.5/air_pollution?lat=53.2744122&lon=-9.0490601&appid=d085bf2d6112ab04eb5701c15be1f63b (GALWAY)
// to get the pollution values
app.get('/pollution', async(req, res) => {
    const latitude = req.query.lat;
    const longitude = req.query.lon;
    if(!longitude || !latitude) {
        return res.status(400).send("Longitude and Latitude values required");
    } try {
        const response = await axios.get(APIUrl3 + `lat=${latitude}` + `&lon=${longitude}` + `&appid=${APIKey}`);
        res.json(response.data);    
    }   catch (err) {
            console.error(err);
            res.status(400).send("ERROR: erorr fetching the data");
    }
});

// Mapbox API for creating a static map image 
const APIUrl4 = "https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/";

// to get the static map image
app.get('/map', async(req, res) => {
    const latitude = req.query.lat;
    const longitude = req.query.lon;
    if(!longitude || !latitude) {
        return res.status(400).send("Longitude and Latitude values required");
    } 
        const mapImage = `${APIUrl4}${longitude},${latitude},8,0,0/400x600?access_token=pk.eyJ1Ijoib2xpdmlhZGVyaGFtIiwiYSI6ImNtMmdsb3BrcjAyYjMya3BraDk5dDd2OXMifQ.Ffcf4fE-c7JldVKBsW6bGg`;
        res.json({image: mapImage});
    
});

app.listen(PORT, () => console.log(`Example app listening on http://localhost:${PORT}`))
