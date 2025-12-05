const express = require('express');
const router = express.Router();

// api route
router.get('/books', function (req, res, next) {

    let sqlquery = "SELECT * FROM books";
    let conditions = [];
    let values = [];
 
    // search
    if (req.query.search) {
        conditions.push("name LIKE ?");
        values.push("%" + req.query.search + "%");
    }

    // price 
    if (req.query.minprice && req.query.maxprice) {
        conditions.push("price >= ? AND price <= ?");
        values.push(req.query.minprice, req.query.maxprice);
    }

    // join conditions
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // sort alphaberically
    if (req.query.sort === "name") {
        sqlquery += " ORDER BY name ASC";
    }

    // sort by price
    else if (req.query.sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    // newest book to be added goes to top of the list
    else if (req.query.sort === "date" || req.query.sort === "id") {
        sqlquery += " ORDER BY id DESC"; 
    }

    db.query(sqlquery, values, (err, result) => {
        if (err) {
            res.json(err);
            next(err);
        } else {
            res.json(result);
        }
    });
});
module.exports = router;