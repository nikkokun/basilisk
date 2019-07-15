const path = require('path');
const async = require('async');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const http = require('http');
const cors = require('cors');
const config = require('./config.js');

const Users = require('./models/Users');
const Devices = require('./models/Devices');

const users = new Users();
const devices = new Devices();

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const io = require("socket.io");
const server = io.listen(666);

const sequenceNumberByClient = new Map();

////////////////////////////// socketio functions
async function onEnableChange(devicename, value) {
  const result = await devices.updateDevice(devicename, 'is_enabled', value);
  return result;
}

async function onAlertChange(devicename, value) {
  const result = await devices.updateDevice(devicename, 'is_alert', value);
  return result;
}

async function onAlarmChange(devicename, value) {
  console.info(devicename, value);
  const result = await devices.updateDevice(devicename, 'is_alarm', value);
  return result;
}

// /////////////////////////// SocketIO Events
// event fired every time a new client connects:
server.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
// initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);

  socket.on('join-room', (data) => {
    socket.join(data.room);
    socket.emit('test-client', {messsage: `you have joined room ${data.room}`});
    server.sockets.in(data.room).emit('test-client', {message: 'welcome to your room'});
  });

  socket.on('test-server', (data) => {
    socket.emit('test-client', data);
  });

  socket.on('server-enable-change', async (data) => {
    const result = await onEnableChange(data.devicename, data.value);
    console.log(result);
    server.sockets.in(data.room).emit('client-enable-change', result);
  });

  socket.on('server-alert-change', async (data) => {
    const result = await onAlertChange(data.devicename, data.value);
    server.sockets.in(data.room).emit('client-alert-change', result);
  });

  socket.on('server-alarm-change', async (data) => {
    const result = await onAlarmChange(data.devicename, data.value);
    server.sockets.in(data.room).emit('client-alarm-change', result);
  });

  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });
});

// ////////////////////////// API's

app.post('/api/register', async (req, res) => {
  if (
    !req.body.hasOwnProperty('email')
    || !req.body.hasOwnProperty('password')
    || !req.body.hasOwnProperty('firstname')
    || !req.body.hasOwnProperty('lastname')
  ) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter'
      });
  }

  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  let results = {};

  try {
    const getUserInfoResults = users.createUser(email, firstname, lastname, password);
    results = await getUserInfoResults;
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: 'email already exists'
      });
  }

  if (results.rowCount === 0) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'error'
      });
  }

  return res.status(200)
    .send({
      results
    });
});

app.post('/api/login', async (req, res) => {
  if (!req.body.hasOwnProperty('email')) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter :email'
      });
  }
  if (!req.body.hasOwnProperty('password')) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter :password'
      });
  }

  const email = req.body.email;
  const password = req.body.password;

  let results = {};

  try {
    const getUserInfoResults = users.authenticateUser(email, password);
    results = await getUserInfoResults;
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: 'email or password is wrong'
      });
  }

  if (results.rowCount === 0) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'error'
      });
  }
  results = results.rows;
  return res.status(200)
    .send({
      results
    });
});

app.post('/api/devices', async (req, res) => {
  if (
    !req.body.hasOwnProperty('devicename')
    || !req.body.hasOwnProperty('devicepass')
    || !req.body.hasOwnProperty('isEnabled')
    || !req.body.hasOwnProperty('isAlert')
    || !req.body.hasOwnProperty('isAlarm')
    || !req.body.hasOwnProperty('ownerId')
  ) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameters'
      });
  }

  const devicename = req.body.devicename;
  const devicepass = req.body.devicepass;
  const isEnabled = req.body.isEnabled;
  const isAlert = req.body.isAlert;
  const isAlarm = req.body.isAlarm;
  const ownerId = req.body.ownerId;

  let results = {};

  try {
    results = await devices.createDevice(
      devicename,
      devicepass,
      isEnabled,
      isAlert,
      isAlarm,
      ownerId
    );
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: e
      });
  }

  return res.status(200)
    .send({
      results
    });
});

app.post('/api/userDevices', async (req, res) => {
  if (!req.body.hasOwnProperty('ownerId')) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter :ownerId'
      });
  }

  const ownerId = req.body.ownerId;

  let results = {};

  try {
    results = await devices.readDevices(
      ownerId
    );
    console.info(results);
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: e
      });
  }

  return res.status(200)
    .send({
      results
    });
});

app.put('/api/devices', async (req, res) => {
  if (
    !req.body.hasOwnProperty('devicename')
    || !req.body.hasOwnProperty('column')
    || !req.body.hasOwnProperty('value')
  ) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameters'
      });
  }

  const devicename = req.body.devicename;
  const column = req.body.column;
  const value = req.body.value;

  let results = {};

  try {
    results = await devices.updateDevice(
      devicename,
      column,
      value
    );
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: e
      });
  }

  console.log(results);

  return res.status(200)
    .send({
      results
    });
});

app.get('/api/devices/:devicename', async (req, res) => {
  if (!req.params.hasOwnProperty('devicename')) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter :devicename'
      });
  }

  const devicename = req.params.devicename;

  let results = {};

  try {
    results = await devices.readDevice(devicename);
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: e
      });
  }

  console.log(results);

  return res.status(200)
    .send({
      results
    });
});

app.get('/api/health_check', async (req, res) => {
  console.log('health_check');
  return res.status(200)
    .send({
      message: 'ok'
    });
});

app.listen(8080, '0.0.0.0', () => console.log('Listening on port 8080!'));
