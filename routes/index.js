const express = require('express');
const router = express.Router();
const rp = require('request-promise');

// Country API
const api = 'https://restcountries.eu/rest/v2/';

// API request options
const options = {
    uri : api + 'all?fields=name;alpha3Code;area;borders;population;flag;languages',
    json : true
};

const getCountryData = (options) => {
    return rp(options);
};


// GET home page
router.get('/', (req, res, next) => {

    // Fetch data, if successfull, render page
    getCountryData(options).then( (data) => {
        res.render('index', { data: data});
    }).catch( (error) => {
        console.log(error);
    });
});

// GET detail page
router.get('/country/:id/', (req, res, next) => {

    // ISO 3166-1 3 letter country code
    const code = req.params.id.toUpperCase();

    // Fetch countrydata
    getCountryData(options)

        // On success, handle the data
        .then( (countries) => {

            // Get the chosen country's data from the array
            const thecountry = countries.find( (country) => {
                return country.alpha3Code === code;
            });

            // Get the neighbouring countries' data in json format
            const neighbours = countries.filter( (country) => {
                return thecountry.borders.includes(country.alpha3Code);
            });

            // Render the page with all the details
            res.render('detail', { current: thecountry, data: countries, borders: neighbours });

        // Handle errors
        }).catch( (error) => {
            res.render('detail');
        });

})

module.exports = router;
