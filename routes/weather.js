const express = require('express');
const router = express.Router();
const request = require('request');

// Load form page — using EJS now
router.get('/', function (req, res) {
    res.render("weather.ejs", { weather: null, error: null, city: "" });
});

// *** Course requirement JSON view ***
router.get('/now', function (req, res, next) {
    var apiKey = process.env.WEATHER_API_KEY;
    var city = 'london';
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            res.send(body); // required for coursework Task 3
        }
    });
});

// Weather POST — with formatted output
router.post('/', function (req, res, next) {
    var city = req.body.city;
    var apiKey = process.env.WEATHER_API_KEY;

    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) return next(err);

        var weather = JSON.parse(body);

        if (weather.cod !== 200) {
            // city error
            return res.render("weather.ejs", {
                weather: null,
                error: "Please enter a real city!",
                city: ""
            });
        }

        // Valid city — send formatted weather to the EJS to display
        res.render("weather.ejs", {
            weather: weather,
            error: null,
            city: weather.name
        });
    });
});

module.exports = router;