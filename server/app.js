// Important imports
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./loadEnv";
import "./bot/bot";

import express from 'express';
import logger from 'morgan';

// Class files
import indexRouter from './routes/index';

const url = "https://whispering-plateau-19340.herokuapp.com/";

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// Prevent heroku from sleeping
setInterval(function() {
    console.log("Fetching the URL: " + url);
    fetch(url);
}, 1200000);

export default app;