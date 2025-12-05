const express = require('express');
const router = express.Router();

router.get('/books', function (req, res, next) {
    const search = req.query.search;
    const min = req.query.minprice;
    const max = req.query.maxprice;

    // sql
    let sqlquery = "SELECT * FROM books";
    const params = [];
    const conditions = [];

    // search somthing
    if (search && search.trim() !== '') {
        conditions.push("name LIKE ?");
        params.push('%' + search.trim() + '%');
    }

    // min price
    if (min && !isNaN(min)) {
        conditions.push("price >= ?");
        params.push(min);
    }

    // max price
    if (max && !isNaN(max)) {
        conditions.push("price <= ?");
        params.push(max);
    }

    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json({ error: err.message });
            return next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;