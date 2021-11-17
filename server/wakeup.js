import fetch from 'node-fetch'

const wakeup = (url, interval, callback) => {
    const milliseconds = interval * 60000;
    setTimeout(() => {
        try {
            console.log("setTimeout has been called.");
            fetch(url).then(() => console.log("Fetching " + url));
        } catch (err) {
            console.log("Error fetching " + url + ", with the error message " + err.message
            + ". Will try again in " + interval + " minutes");
        } finally {
            try {
                callback();
            } catch (err) {
                callback ? console.log("Callback failed: ", err.message) : null;
            } finally {
                return wakeup(url, interval, callback);
            }
        }
    }, milliseconds);
}

export default wakeup;
