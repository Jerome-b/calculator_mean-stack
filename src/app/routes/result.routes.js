const express = require('express');
const resultRoute = express.Router();

// Result model
let Result = require('../backend/models/result.model');

// Add results
resultRoute.route('/post').post((req, res, next) => {
  Result.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all results
resultRoute.route('/').get((_req, res) => {
  Result.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

module.exports = resultRoute;
