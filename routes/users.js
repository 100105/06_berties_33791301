// Create a new router
const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    
    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err)
        }
        
        let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)"
        let newrecord = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ]

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            } else {
                let resultMessage = 
                    'Hello ' + req.body.first + ' ' + req.body.last +
                    ', you are now registered! We will send an email to you at ' + req.body.email + '<br>'

                resultMessage += 
                    'Your password is: ' + req.body.password + '<br>' +
                    'Your hashed password is: ' + hashedPassword

                res.send(resultMessage)
            }
        })
        
    })  
})      

router.get('/list', function (req, res, next) {

    let sqlquery = "SELECT username, first, last, email FROM users";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.render("listusers.ejs", { users: result })
        }
    });
});

router.post('/loggedin', function(req, res, next) {

    let username = req.body.username
    let suppliedPassword = req.body.password
    let sqlquery = "SELECT * FROM users WHERE username = ?"

    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            return next(err)
        }

        if (result.length === 0) {
            res.send("Login failed: username not found.")
        }
        else {
            let hashedPassword = result[0].hashedPassword

            bcrypt.compare(req.body.password, hashedPassword, function(err, compareResult) {

                if (err) {
                    res.send("An error occurred during login.")
                }
                else if (compareResult == true) {
                    res.send("Login successful! Welcome back, " + username)
                }
                else {
                    res.send("Login failed: incorrect password.")
                }

            }) 
        }
    })
})


module.exports = router