// Important imports
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./loadEnv";
import "./bot/bot";
import wakeup from './wakeup'

import express from 'express';
import logger from 'morgan';

// Class files
import indexRouter from './routes/index';

const url = "https://whispering-plateau-19340.herokuapp.com/";
const port = process.env.PORT || 80;

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

app.listen(port, () => {
    wakeup(url);
})

export default app;