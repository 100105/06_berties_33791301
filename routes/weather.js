const express = require('express');
const router = express.Router();
const request = require('request');


// weather form
router.get('/', function (req, res) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Weather</title>
            <style>
                body {
                    font-family: "Poppins", Arial, sans-serif;
                    background-color: #f9f5f2;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    color: #4a3f35;
                }
                header {
                    background-color: #d9b8a3;
                    color: white;
                    padding: 25px;
                    letter-spacing: 1px;
                }
                h1 {
                    margin: 0;
                    font-size: 30px;
                }
                h2 {
                    margin-top: 30px;
                    font-size: 24px;
                    font-weight: 500;
                    color: #a07c68;
                }
                input[type="text"] {
                    padding: 8px;
                    width: 260px;
                    border: 1px solid #caa088;
                    border-radius: 4px;
                    margin-bottom: 15px;
                }
                input[type="submit"] {
                    background-color: #d9b8a3;
                    color: white;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                }
                input[type="submit"]:hover {
                    background-color: #c39b87;
                }
                a {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 18px;
                    background-color: #d9b8a3;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                }
                a:hover {
                    background-color: #c39b87;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Bertie’s Bookshop</h1>
            </header>
            <h2>Check the Weather</h2>

            <form action="/weather" method="POST">
                <input type="text" name="city" placeholder="Enter a city name" required>
                <input type="submit" value="Get Weather">
            </form>

            <a href="/">Return to Home</a>
        </body>
        </html>
    `);
});


// json 
router.get('/now', function (req, res, next) {

    var apiKey = process.env.WEATHER_API_KEY;
    var city = 'london';

    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            res.send(body); 
        }
    });
});

//designed outcone
router.post('/', function (req, res, next) {

    var city = req.body.city;
    var apiKey = process.env.WEATHER_API_KEY;

    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) return next(err);

        var weather = JSON.parse(body);

        // fake city
        if (weather.cod !== 200) {
            return res.send(`
                <html>
                <body style="font-family:Poppins;text-align:center;background:#f9f5f2;padding-top:50px;color:#4a3f35;">
                    <h2>City not found!</h2>
                    <a style="background:#d9b8a3;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;" href="/weather">search again</a>
                    <a style="background:#d9b8a3;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;" href="/">back to home</a>
                </body>
                </html>
            `);
        }

        // real city    
        var wmsg =
            'It is ' + weather.main.temp +
            'degrees in ' + weather.name +
            '! <br> The humidity now is: ' +
            weather.main.humidity +
            '% <br> The wind speed is: ' +
            weather.wind.speed + ' m/s';

        

        res.send(`
            <html>
            <body style="font-family: Arial, sans-serif; text-align:center; background:#f9f5f2; padding-top:50px; color:#4a3f35; line-height:1.6; font-size:18px;">                <h2>${wmsg}</h2>
                <a style="background:#d9b8a3;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;" href="/weather">Search Again</a>
                <br><br>
                <a style="background:#d9b8a3;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;" href="/">Return Home</a>
            </body>
            </html>
        `);
    });
});

module.exports = router;