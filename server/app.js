// Important imports
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./loadEnv";
import "./bot/bot";

import express from 'express';
import logger from 'morgan';

// Class files
import indexRouter from './routes/index';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

export default app;