const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {getAsync, setAsync} = require("./redis-client/client");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/api/register', function (req, res) {
    const {username, email, password} = req.body;
    //const user = new User({ email, password });

    getAsync('acc:' + username).then(value => {
        if(!value) {
            setAsync('acc:' + username, JSON.stringify({username: username, email: email, password: password})).then(() => {
                setAsync('user:' + username, '').then(() => {
                    res.status(200).send(JSON.stringify({message: "Welcome to the club!"}));
                });
            });
        } else if (value.length !== 0) {
            res.statusMessage = "User already exists";
            res.status(401)
                .send(JSON.stringify({message: "User already exists"}));
        } else {
            res.status(500)
                .send(JSON.stringify({message: "Internal error"}));
        }
        console.log('i tutaj');
    }).catch(reason => {
        res.status(401)
            .send(JSON.stringify({message: reason}));
    });
});


app.post('/api/login', function (req, res) {
    const {username, password} = req.body;
    const userCred = {username: 'xgg', password: 'xgg'};

    getAsync('acc:' + username).then(value => {
        if(!value) {
            console.log('jestem tutaj');
            res.statusMessage = "Bad login or password";
            res.status(401)
                .send( "Bad login or password");
        } else {
            let ans = JSON.parse(value);
            if (password === ans.password) {
                res.status(200).send(JSON.stringify({message: "Welcome to the club!"}));
            } else {
                res.statusMessage = "Bad login or password";
                res.status(401)
                    .send("Bad login or password");
            }
        }
    });

    console.log('przyszlo: ', username, password);
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
