const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {getAsync, setAsync} = require("./redis-client/client");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/api/register', function (req, res) {
    const {name, email, password} = req.body;
    //const user = new User({ email, password });

    getAsync('user:' + name).then(value => {
        if(value.length !== 0){
            res.status(500)
                .send("Error registering new user please try again.");
        }
        setAsync('user:' + name, JSON.stringify(Categories)).then(() => {
            res.status(200).send("Welcome to the club!");
        });
    });
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
