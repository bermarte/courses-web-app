'use strict'

const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const config = require('../config');
const DATA_DIR = path.join(__dirname, '..', 'data', 'courses.json');

const controllers = {
  hello: (req, res) => {
    res.json({ api: 'courses!' });
  }
};

module.exports = controllers;
