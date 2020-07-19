const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const dotenv        = require("dotenv");
const cors          = require('cors');
const mongoose      = require('mongoose');

const indexRouter   = require('./routes/index');
const usersRouter   = require('./routes/users');

const app           = express();

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`, { useFindAndModify: false, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
    origin: 'http://localhost:3000'
  }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
