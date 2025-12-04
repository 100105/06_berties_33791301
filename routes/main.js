// Create a new router
const express = require("express")
const router = express.Router()

// install request
const request = require('request');

const redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.redirect("./users/login");
    }
    next();
  };
  
// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});
//just checking if this commit works

//weather route
router.get('/weather/now', function (req, res, next) {

  let apiKey = '0fcf6ff21b366aea30bcb1cdb8bbfd2e'; // <-- put YOUR key here
  let city = 'london';
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
      if (err) {
          next(err);
      } else {
        //  res.send(body);
        var weather = JSON.parse(body)
        var wmsg = 'It is '+ weather.main.temp + 
          ' degrees in '+ weather.name +
          '! <br> The humidity now is: ' + 
          weather.main.humidity;
        res.send (wmsg);

      }
  });
})
 
//logout
router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})

// Export the router object so index.js can access it
module.exports = router