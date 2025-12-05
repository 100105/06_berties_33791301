const express = require('express');
const router = express.Router();
const request = require('request');

// weather form
router.get('/', function (req, res) {
    res.send(`
        <h2>Check the Weather</h2>
        <form action="/weather" method="POST">
            <input type="text" name="city" placeholder="Enter city" required>
            <button type="submit">Get Weather</button>
        </form>
        <p><a href="/">Return Home</a></p>
    `);
});

// json
router.get('/now', function (req, res, next) {

    var apiKey = process.env.WEATHER_API_KEY;
    var city = 'london';
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) next(err);

        var weather = JSON.parse(body);
        var wmsg = 'It is '+ weather.main.temp +
        ' degrees in '+ weather.name +
        '! <br> The humidity now is: ' +
        weather.main.humidity;

        res.send(wmsg);
    });
});

// post city
router.post('/', function (req, res, next) {

    var city = req.body.city;
    var apiKey = process.env.WEATHER_API_KEY;

    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) next(err);

        var weather = JSON.parse(body);

        if (weather.cod !== 200) {
            return res.send("City not found. <a href=\"/weather\">Try again</a>");
        }

        var wmsg = 'It is '+ weather.main.temp +
        ' degrees in '+ weather.name +
        '! <br> The humidity now is: ' +
        weather.main.humidity;

        res.send(wmsg + '<br><a href="/weather">Search again</a>');
    });
});

module.exports = router;