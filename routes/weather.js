const express = require("express");
const router = express.Router();
const request = require("request");

// GET /weather — Show form to enter city
router.get('/', (req, res) => {
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
          color: #4a3f35;
          text-align: center;
        }
        header {
          background-color: #d9b8a3;
          color: white;
          padding: 25px;
          text-align: center;
          letter-spacing: 1px;
        }
        h1 {
          margin: 0;
          font-size: 30px;
        }
        form {
          margin-top: 30px;
        }
        input[type="text"] {
          padding: 8px;
          width: 250px;
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
          margin-left: 6px;
        }
        a {
          display: inline-block;
          margin-top: 20px;
          color: #d9b8a3;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>

    <body>
      <header>
        <h1>Bertie’s Bookshop</h1>
      </header>

      <h2>Check the Weather</h2>
      <form action="/weather" method="POST">
        <input type="text" name="city" placeholder="Enter city (e.g. London)" required>
        <button type="submit">Get Weather</button>
      </form>

      <a href="/">Return to Home</a>
    </body>
    </html>
    `);
});

// london weather forecast
router.get("/now", function(req, res, next) {
    let apiKey = process.env.WEATHER_API_KEY;
    let city = 'london';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            var weather = JSON.parse(body);
            var wmsg = 'It is '+ weather.main.temp + 
            ' degrees in '+ weather.name +
            '! <br> The humidity now is: ' +
            weather.main.humidity;
            res.send(wmsg);
        }
    });
});

// chosen city form
router.post("/", function(req, res, next) {

    let city = req.sanitize(req.body.city);
    let apiKey = process.env.WEATHER_API_KEY;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            var weather = JSON.parse(body);

            if (weather.cod != 200) {
                return res.send("City not found/.");
            }

            var wmsg = 'It is '+ weather.main.temp + 
            ' degrees in '+ weather.name +
            '! <br> The humidity now is: ' +
            weather.main.humidity;
            res.send(wmsg);
        }
    });
});

module.exports = router;