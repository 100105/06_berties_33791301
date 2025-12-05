const express = require('express');
const router = express.Router();
const request = require('request');

// Weather form 
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
                    text-align: center;
                    padding-top: 50px;
                    color: #4a3f35;
                }
                header {
                    background-color: #d9b8a3;
                    color: white;
                    padding: 25px;
                    letter-spacing: 1px;
                }
                input[type="text"] {
                    padding: 8px;
                    width: 250px;
                    margin-bottom: 15px;
                    border: 1px solid #caa088;
                    border-radius: 4px;
                }
                button {
                    padding: 10px 15px;
                    background-color: #d9b8a3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 18px;
                    background-color: #d9b8a3;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                }
            </style>
        </head>
        <body>
            <header><h1>Bertie’s Bookshop</h1></header>
            <h2>Check the Weather</h2>
            <form action="/weather" method="POST">
                <input type="text" name="city" placeholder="Enter City" required>
                <button type="submit">Get Weather</button>
            </form>
            <a class="btn" href="/">Return Home</a>
        </body>
        </html>
    `);
});

//json
router.get('/now', function (req, res, next) {

    var apiKey = process.env.WEATHER_API_KEY;
    var city = 'london';
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            res.send(body); // EXACT coursework requirement
        }
    });
});

// Weather POST 
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
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Weather Error</title>
                    <style>
                        body {
                            font-family: "Poppins", Arial, sans-serif;
                            background-color: #f9f5f2;
                            text-align: center;
                            padding-top: 50px;
                            color: #4a3f35;
                        }
                        header {
                            background-color: #d9b8a3;
                            color: white;
                            padding: 25px;
                            letter-spacing: 1px;
                        }
                        .btn {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 18px;
                            background-color: #d9b8a3;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                        }
                    </style>
                </head>
                <body>
                    <header><h1>Bertie’s Bookshop</h1></header>
                    <h2>Please enter an existing city</h2>
                    <a class="btn" href="/weather">Try Again</a>
                    <a class="btn" href="/">Return Home</a>
                </body>
                </html>
            `);
        }
        
        // real city    
        var wmsg =
            'It is ' + weather.main.temp +
            ' degrees in ' + weather.name +
            '! <br> The humidity now is: ' +
            weather.main.humidity;

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Weather Result</title>
                <style>
                    body {
                        font-family: "Poppins", Arial, sans-serif;
                        background-color: #f9f5f2;
                        text-align: center;
                        padding-top: 50px;
                        color: #4a3f35;
                    }
                    header {
                        background-color: #d9b8a3;
                        color: white;
                        padding: 25px;
                        letter-spacing: 1px;
                    }
                    .btn {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 18px;
                        background-color: #d9b8a3;
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                    }
                </style>
            </head>
            <body>
                <header><h1>Bertie’s Bookshop</h1></header>
                <h2>${wmsg}</h2>
                <a class="btn" href="/weather">Search Again</a>
                <a class="btn" href="/">Return Home</a>
            </body>
            </html>
        `);
    });
});

module.exports = router;
