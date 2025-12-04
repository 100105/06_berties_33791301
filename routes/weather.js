const express = require("express");
const router = express.Router();
const request = require("request");

router.get("/", function(req, res) {
    res.send(`
        <html>
        <body style="font-family: Arial; background:#f9f5f2; color:#4a3f35; text-align:center; margin-top:50px;">
            <h2>Check the Weather</h2>
            <form action="/weather" method="POST">
                <input type="text" name="city" placeholder="Enter city" required>
                <button type="submit">Get Weather</button>
            </form>
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