const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const Promise = require('bluebird');
const BFS = require('bfs-as-promised');

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


// Renders the home page with a list of countries
router.get('/', (req, res, next) => {

    // Fetch data, if successful, render page
    getCountryData(options)
        .then( (countryData) => {
            res.render('index', { data: countryData});
    })
        .catch( (error) => {
            console.log('Country data not found');
            console.log(error);
            res.render('index');
    });
});


// Renders a detail page with information about a country
router.get('/country/:id/', (req, res, next) => {

    const countryCode = req.params.id.toUpperCase();

    getCountryData(options)

        .then( (countries) => {

            // Extract the current page's country's data from the dump
            const thecountry = countries.find( (country) => {
                return country.alpha3Code === countryCode;
            });

            // Also extract the neighbouring countries' data
            const neighbours = countries.filter( (country) => {
                return thecountry.borders.includes(country.alpha3Code);
            });

            res.render('detail', {
                current : thecountry,
                data    : countries,
                borders : neighbours });

        }).catch( (error) => {
            res.render('detail');
        });
});


/**
 * This endpoint handles post requests sent to the uri /country/<id>/.
 * It returns a string representing the shortest route from starting country
 * to target country as defined in the POST request's body data.
 */
router.post('/country/:id/', (req, res, next) => {

    // Country data and neighbours are represented as a graph
    let graph = new Map();

    getCountryData(options)

        .then( (countries) => {

            /* Fill the graph with countries' codes as
             * keys and their neighbours as values */
            countries.forEach( (country) => {
                graph.set(country.alpha3Code, country.borders);
            });


            /* Returns a map where the key is a value from the array
             * fromNodes and the value is an array of nodes that can be
             * reached from the given key. */
            const getMoves = (fromNodes) => {
                let result = new Map()
                return new Promise
                    .each(fromNodes, (fromNode) => {
                        result.set(fromNode, graph.get(fromNode) || [])
                    })
                    .return(result)
            };

            // Compares a string to the client's defined target
            const isGoal = (item) => item === req.body.target;

            const bfs = new BFS(req.body.source, getMoves, isGoal);

            // Calculate the route and send it as a response to the client
            bfs.find().then( (path) => {

                /* Instead of the 3 letter codes, we want the countries'
                 * full names. Furthermore, instead of an array like
                 * ['Finland', 'Norway'] we want a string such as
                 * 'Finland -> Norway'.
                 */
                const route = path.map( (node) => {
                    return countries.find( (country) => {
                        return country.alpha3Code === node
                    }).name;
                }).join(' -> ');

                res.send(route);

            }).catch( (error) => {
                const route = 'No land route found';
                res.send(route);
            });

        // Handle errors in data fetching
        }).catch( (error) => {
            console.log('error');
            console.log(error);
            res.send(error);
        });
});


module.exports = router;
