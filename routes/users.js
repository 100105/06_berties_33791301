const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Redirect if not logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("./users/login");
    } else {
        next();
    }
};

// REGISTER PAGE
router.get('/register', function (req, res) {
    res.render("register.ejs");
});

// REGISTER USER
router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        if (err) return next(err);

        let sqlquery = `
            INSERT INTO users (username, first, last, email, hashedPassword)
            VALUES (?, ?, ?, ?, ?)
        `;

        let newrecord = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ];

        db.query(sqlquery, newrecord, (err) => {
            if (err) return res.send("User already exists!");

            res.send(`Hello ${req.body.first} ${req.body.last},
                      you are now registered!`);
        });
    });
});

// USERS LIST — PROTECTED
router.get('/list', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT username, first, last, email FROM users";

    db.query(sqlquery, (err, result) => {
        if (err) next(err);
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
            // Audit failed login
            db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)",
                [username, false]);

            return res.send("Login failed: username not found.");
        }

        let hashedPassword = result[0].hashedPassword;

        bcrypt.compare(suppliedPassword, hashedPassword, function (err, match) {
            if (err) return res.send("Error during login.");

            if (match) {
                // Save session
                req.session.userId = username;

                // Audit successful login
                db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)",
                    [username, true]);

                res.send("Login successful! Welcome back, " + username);
            } else {
                // Audit incorrect password
                db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)",
                    [username, false]);

                res.send("Login failed: incorrect password.");
            }
        });
    });
});

// AUDIT PAGE — PROTECTED
router.get('/audit', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM login_audit ORDER BY login_time DESC";

    db.query(sqlquery, (err, result) => {
        if (err) next(err);
        res.render("audit.ejs", { logs: result });
    });
});

module.exports = router;
