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
        <input type="text" name="city" placeholder="Enter city" required>
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
// POST /weather — Fetch weather & display nicely
router.post('/', (req, res, next) => {
    let city = req.body.city;
    let apiKey = process.env.WEATHER_API_KEY;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            var weather = JSON.parse(body);

            // This is the required coursework output:
            var wmsg = 'It is '+ weather.main.temp +
              ' degrees in '+ weather.name +
              '! <br> The humidity now is: ' +
              weather.main.humidity;

            // Styled display
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
                        margin: 0;
                        padding: 0;
                        text-align: center;
                        color: #4a3f35;
                    }
                    header {
                        background-color: #d9b8a3;
                        color: white;
                        padding: 25px;
                        text-align: center;
                        letter-spacing: 1px;
                    }
                    .container {
                        margin-top: 40px;
                        font-size: 22px;
                        font-weight: 500;
                    }
                    a {
                        display: inline-block;
                        margin-top: 25px;
                        padding: 10px 15px;
                        background-color: #d9b8a3;
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                    }
                </style>
            </head>

            <body>
                <header>
                    <h1>Bertie’s Bookshop</h1>
                </header>

                <div class="container">
                    ${wmsg}
                </div>

                <a href="/weather">Check Another City</a><br>
                <a href="/">Return to Home</a>
            </body>
            </html>
            `);
        }
    });
});

module.exports = router;