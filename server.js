// Get dependencies
const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const bcrypt = require('bcryptjs');
var cors = require('cors')
const mongo = require('mongodb');
const mongoose = require('mongoose');
const config = require('./server/config');
const db = mongoose.connection;
const scheduler = require('./server/schedule/scheduler')
const fs = require('fs')
// Get our API routes
const apiUsers = require('./server/routes/api.users');
const apiProperty = require('./server/routes/api.property');
const apiNotification = require('./server/routes/api.notification');
const apiEvent = require('./server/routes/api.event');
const apiEventHost = require('./server/routes/api.eventhost');
const apiBulkMenu=require('./server/routes/api.bulkmenu');
const apiMenu=require('./server/routes/api.menu');
const apiMessage=require('./server/routes/api.message')
const app = express();

app.use(expressValidator());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Add headers
app.use(cors({credentials: true, origin: true }));

app.use(passport.initialize());

// Set our api routes
app.use('/api/users', apiUsers);
app.use('/api/property', apiProperty);
app.use('/api/notification', apiNotification);
app.use('/api/event', apiEvent);
app.use('/api/eventhost', apiEventHost);
app.use('/api/menu',apiMenu);
app.use('/api/property',apiBulkMenu);
app.use('/api/message',apiMessage);
// Used for images
var dir = path.join(__dirname, '/server/uploads/images/');
app.use('/images', express.static(dir));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.json({});
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || config.port;
app.set('port', port);


/**
 * Create HTTP server.
 */
const SSLserver = https.createServer({
  key:fs.readFileSync(path.join(__dirname,'mobileapp.asucla.ucla.edu.key')),
  cert:fs.readFileSync(path.join(__dirname,'mobileapp_asucla_ucla_edu_cert.cer')),
},app);

/**
 * Listen on provided port, on all network interfaces.
 */
 SSLserver.listen(port, () => console.log(`API running on localhost:${port}`));
