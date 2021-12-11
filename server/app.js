// Important imports
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./load-env";
import "./bot/bot";
import axios from 'axios';

import express from 'express';
import logger from 'morgan';

// Class files
import indexRouter from './routes/index';

const url = "https://wakabubot.herokuapp.com/";
//const url = 'http://localhost:3000';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// Prevent heroku from sleeping
setInterval(async function() {
    console.log("Fetching the URL: " + url);
     axios.get(url).then(res => {
         console.log(res.data);
     }).catch(console.log("Unable to fetch the website's URL"));
}, 100000);

export default app;