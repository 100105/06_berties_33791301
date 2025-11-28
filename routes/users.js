const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// express-validator
const { check, validationResult } = require('express-validator');

// Redirect if not logged in
const redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect("./login");
    }
    next();
};

// REGISTER PAGE
router.get('/register', function (req, res) {
    res.render("register.ejs", { 
        errors: [], 
        data: {} 
    });
});

// REGISTER USER — VALIDATION + HASHING
router.post(
    '/registered',
    [
        // first + last name required
        check('first')
            .trim()
            .notEmpty()
            .withMessage("First name is required"),

        check('last')
            .trim()
            .notEmpty()
            .withMessage("Last name is required"),

        // email format
        check('email')
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email address"),

        // username length + characters
        check('username')
            .trim()
            .isLength({ min: 5, max: 20 })
            .withMessage("Username must be between 5 and 20 characters")
            .matches(/^[A-Za-z0-9_]+$/)
            .withMessage("Username can only contain letters, numbers and underscores"),

        // password length (Task 3)
        check('password')
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
    ],
    function (req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Re-render form with messages + previous values
            return res.render("register.ejs", { 
                errors: errors.array(),
                data: req.body 
            });
        }

        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
            if (err) return next(err);

            let sqlquery = `
                INSERT INTO users (username, first, last, email, hashedPassword)
                VALUES (?, ?, ?, ?, ?)
            `;

            let newrecord = [
                req.body.username.trim(),
                req.body.first.trim(),
                req.body.last.trim(),
                req.body.email.trim(),
                hashedPassword
            ];

            db.query(sqlquery, newrecord, (err) => {
                if (err) {
                    // probably duplicate username
                    return res.send("Registration failed: username already exists.");
                }

                res.send(
                    `Hello ${req.body.first} ${req.body.last}, you are now registered!`
                );
            });
        });
    }
);

// USERS LIST — PROTECTED
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

// LOGIN AUTHENTICATION + AUDIT
router.post('/loggedin', function (req, res, next) {
    let username = req.body.username;
    let suppliedPassword = req.body.password;
    let sqlquery = "SELECT * FROM users WHERE username = ?";

    db.query(sqlquery, [username], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
            // Audit failed login (no such user)
            db.query(
                "INSERT INTO login_audit (username, success) VALUES (?, ?)",
                [username, false]
            );
            return res.send("Login failed: username not found.");
        }

        let hashedPassword = result[0].hashedPassword;

        bcrypt.compare(suppliedPassword, hashedPassword, function (err, match) {
            if (err) return res.send("Error during login.");

            if (match) {
                // Save session
                req.session.userId = username;

                // Audit success
                db.query(
                    "INSERT INTO login_audit (username, success) VALUES (?, ?)",
                    [username, true]
                );

                res.send("Login successful! Welcome back, " + username);
            } else {
                // Audit incorrect password
                db.query(
                    "INSERT INTO login_audit (username, success) VALUES (?, ?)",
                    [username, false]
                );
                res.send("Login failed: incorrect password.");
            }
        });
    });
});

// AUDIT PAGE — PROTECTED
router.get('/audit', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM login_audit ORDER BY login_time DESC";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("audit.ejs", { logs: result });
    });
});

module.exports = router;