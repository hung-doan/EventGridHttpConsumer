const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8008;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(`${(new Date()).toLocaleString()} - RECEIVED: ${fullUrl}`);
    res.sendStatus(200);
});

app.post('/event-handler', (req, res) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(`${(new Date()).toLocaleString()} - RECEIVED: ${fullUrl}`);
    console.log(req.body);


    // Event Grid validation
    let header = req.headers["aeg-event-type"];
    if (header && header === 'SubscriptionValidation') {
        var event = req.body[0];
        var isValidationEvent = event && event.data &&
            event.data.validationCode &&
            event.eventType && event.eventType == 'Microsoft.EventGrid.SubscriptionValidationEvent';
        if (isValidationEvent) {
            return res.status(200).send({
                "validationResponse": event.data.validationCode
            });
        }
    }
    
    res.sendStatus(200);
});

app.listen(port, () => console.log(`App listening on port ${port}!`))