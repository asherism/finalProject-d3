"use strict";
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// var server = require('http').createServer(app);
// var io = require('socket.io')(server);

// io.on('connection', function(data){
//     console.log(data)

// });
//server.listen(3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const requestSettings = {
    method: 'GET',
    url: 'http://gtfs.halifax.ca/realtime/Vehicle/VehiclePositions.pb',
    // url: 'http://gtfs.halifax.ca/realtime/TripUpdate/TripUpdates.pb',
    // url: 'http://gtfs.halifax.ca/realtime/Alert/Alerts.pb',
    encoding: null
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// request(requestSettings, (error, response, body) => {
//     if (!error && response.statusCode == 200) {
//         let feed = GtfsRealtimeBindings.FeedMessage.decode(body);
//         feed.entity.forEach(bus => {
//             console.log(bus.vehicle.position);
//         })
//     } else { console.log(error) }
// });

app.get('/get', (req, res) => {
    request(requestSettings, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            let feed = GtfsRealtimeBindings.FeedMessage.decode(body);
            res.send(feed.entity)
        } else { console.log(error) }
    });
})



app.listen(9000, () => {
    console.log('Server Started on http://localhost:%s', 3000);
    console.log('Press CTRL + C to stop server');
});