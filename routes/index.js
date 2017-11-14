var express = require('express');
var router = express.Router();
var rp = require('request-promise');

var options = {
    uri: 'https://restcountries.eu/rest/v2/all',
    json: true
};


/* GET home page. */
router.get('/', (req, res, next) => {
    rp(options)
        .then( (countries) => {
            res.render('index', { countrydata: countries});
        }).catch( (error) => {
            console.log(error);
        });
});

module.exports = router;
