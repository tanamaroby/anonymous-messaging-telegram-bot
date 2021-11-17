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
const port = process.env.PORT || 80;

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

const wakeup = (url, interval = 25, callback) => {
    const milliseconds = interval * 60000;
    setTimeout(() => {
        try {
            console.log("setTimeout has been called.");
            fetch(url).then(() => console.log("Fetching " + url));
        } catch (err) {
            console.log("Error fetching " + url + ", will try again in " + interval + " minutes");
        } finally {
            try {
                callback();
            } catch (err) {
                callback ? console.log("Callback failed: ") : null;
            } finally {
                return wakeup(url, interval, callback);
            }
        }
    }, milliseconds);
}

app.listen(port, () => {
    wakeup(url);
})

export default app;