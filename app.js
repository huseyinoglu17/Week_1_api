const express = require('express');
const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
const reportsRoutes = require('./routes/reports');
const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/users', usersRoutes);
app.use('/tasks', tasksRoutes);
app.use('/reports', reportsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
