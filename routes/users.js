const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { check, validationResult } = require('express-validator');

// Redirect if not logged in — matches coursework EXACTLY
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('./login');
    } else {
        next();
    }
};

// REGISTER PAGE
router.get('/register', function (req, res) {
    res.render("register.ejs", { 
        errors: [], 
        data: {} 
    });
});

// REGISTER — VALIDATION + HASHING
router.post(
    '/registered',
    [
        check('first').trim().notEmpty().withMessage("First name is required"),
        check('last').trim().notEmpty().withMessage("Last name is required"),
        check('email').trim().isEmail().withMessage("Invalid email"),
        check('username').trim().isLength({ min: 5, max: 20 })
            .withMessage("Username must be 5-20 characters"),
        check('password').isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters")
    ],
    function (req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("register.ejs", { 
                errors: errors.array(),
                data: req.body 
            });
        }

        bcrypt.hash(req.body.password, saltRounds, function (err, hashedPassword) {
            if (err) return next(err);

            let sqlquery = `
                INSERT INTO users (username, first, last, email, hashedPassword)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(sqlquery, [
                req.body.username,
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPassword
            ], (err) => {
                if (err) return res.send("Registration failed: username already exists.");

                res.send(`
                    <html>
                    <head>
                      <style>
                        body {
                          font-family: "Poppins", Arial, sans-serif;
                          background-color: #f9f5f2;
                          text-align: center;
                          padding-top: 50px;
                          color: #4a3f35;
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
                      <h2>You are now registered, ${req.body.first}!</h2>
                      <p>We have sent an email to <strong>${req.body.email}</strong></p>
                      <a class="btn" href="../">Return to Home</a>
                    </body>
                    </html>
                `);
            });
        });
    }
);

// USERS LIST
router.get('/list', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT username, first, last, email FROM users";
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("listusers.ejs", { users: result });
    });
});

// LOGIN PAGE
router.get('/login', function (req, res) {
    res.render("login.ejs");
});

// LOGIN with Styled Success + Audit Logging
router.post('/loggedin', function (req, res, next) {
    let username = req.body.username;
    let suppliedPassword = req.body.password;

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
            db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)", [username, false]);
            return res.send("Login failed: username not found.");
        }

        bcrypt.compare(suppliedPassword, result[0].hashedPassword, function (err, match) {
            if (err) return res.send("Error during login.");

            if (!match) {
                db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)", [username, false]);
                return res.send("Login failed: incorrect password.");
            }

            // SUCCESS 
            req.session.userId = username;
            db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)", [username, true]);

            return res.send(`
                <html>
                <head>
                  <style>
                    body {
                      font-family: "Poppins", Arial, sans-serif;
                      background-color: #f9f5f2;
                      text-align: center;
                      padding-top: 50px;
                      color: #4a3f35;
                    }
                    .btn {
                      display: inline-block;
                      margin: 12px;
                      padding: 10px 18px;
                      background-color: #d9b8a3;
                      color: white;
                      text-decoration: none;
                      border-radius: 6px;
                    }
                  </style>
                </head>
                <body>
                  <h2>Welcome back, ${username}! 🎉</h2>
                  <a class="btn" href="../">Return to Home</a>
                  <a class="btn" href="../books/list">View Books</a>
                </body>
                </html>
            `);
        });
    });
});

// AUDIT PAGE
router.get('/audit', redirectLogin, function (req, res, next) {
    db.query("SELECT * FROM login_audit ORDER BY login_time DESC", (err, result) => {
        if (err) return next(err);
        res.render("audit.ejs", { logs: result });
    });
});

module.exports = router;