// Core modules

var express = require('express');  
var path = require('path');  
var dotenv = require('dotenv').config();
var favicon = require('serve-favicon');  
var logger = require('morgan');  
var cookieParser = require('cookie-parser');  
var bodyParser = require('body-parser');  
var cors = require('cors');
var dateFormat = require('dateformat');
var md5 = require('md5');  
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var in_array = require('in_array');
var moment = require('moment'); 


//Custom modules
var routes = require('./routes/index');  
var users = require('./routes/users');  
var uTasks = require('./routes/uTask'); 
var Teams = require('./routes/Teams');
var uInfo = require('./routes/uInfo');
var Builds = require('./routes/Build');
var Tasks = require('./routes/Tasks');
var subTasks = require('./routes/subTasks'); 
var uLogin = require('./routes/uLogin'); 
var AllUserInfo = require('./routes/AllUserInfo');
var testAddTask = require('./routes/testAddtask');
var getAddedTask = require('./routes/getAddedTask');
var loadTeam = require('./routes/loadTeam');
var loadTasks = require('./routes/loadTasks');
var loadBuilds = require('./routes/loadBuilds');
var testGetDate = require('./routes/testGetDate');
var UserOT = require('./routes/UserOtTasks');
var UserReports = require('./routes/UserReports');
var SdaReports = require('./routes/SdaReports');
var FP = require('./routes/fp');
var reg = require('./routes/Register'); 
var approve = require('./routes/approve');
var CP = require('./routes/cp');
var myTeam = require('./routes/loadTeamForReg');
var chart = require('./routes/PrepareChart');
var Release = require('./routes/Release');
var wu = require('./routes/ManualDailyCount');
var mwu = require('./routes/ManualWuCalc');
var loadcftasks  = require('./routes/loadTsAndSsWithCf');
var autoCF = require('./routes/AutoCFCalc');
var atu = require('./routes/AutoCFLoad');
var ncf = require('./routes/NonCFLoad');
var mcf = require('./routes/ManualCFLoad');

// Express init
var app = express();  


// view engine setup  
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'jade');  


// Custom  favicon in /public only this favicon will be used  
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  

//Init other middlewares
app.use(cors());  
app.use(logger('dev'));  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({  
    extended: false  
}));  
app.use(cookieParser());  
app.use(express.static(path.join(__dirname, 'public')));  


//Routes goes here add custom routes
app.use('/', routes);  
app.use('/users', users);  
app.use('/uTasks', uTasks); 
app.use('/Teams', Teams);
app.use('/uInfo', uInfo);
app.use('/Builds', Builds);
app.use('/Tasks', Tasks);
app.use('/subTasks', subTasks);
app.use('/login', uLogin);
app.use('/AllUserInfo', AllUserInfo);
app.use('/test' , testAddTask);
app.use('/getAddedTask', getAddedTask);
app.use('/loadTeam', loadTeam);
app.use('/loadTasks', loadTasks);
app.use('/loadBuilds', loadBuilds);
app.use('/testGetDate', testGetDate);
app.use('/userot', UserOT);
app.use('/userReports' , UserReports );
app.use('/SdaReports' , SdaReports); 
app.use('/fp' , FP);
app.use('/reg' , reg);
app.use('/approve', approve);
app.use('/cp', CP);
app.use('/myTeam' , myTeam);
app.use('/chart', chart);
app.use('/Release', Release);
app.use('/wu' , wu);
app.use('/mwu', mwu);
app.use('/loadcftasks', loadcftasks);
app.use('/autoCF', autoCF);
app.use('/atu', atu);
app.use('/ncf', ncf);
app.use('/mcf' , mcf);

// catch 404 and forward to error handler  
app.use(function(req, res, next) {  
    var err = new Error('Not Found');  
    err.status = 404;  
    next(err);  
});  
// error handlers  
// development error handler  
// will print stacktrace  
if (app.get('env') === 'development') {  
    app.use(function(err, req, res, next) {  
        res.status(err.status || 500);  
        res.render('error', {  
            message: err.message,  
            error: err  
        });  
    });  
}  
// production error handler  
// no stacktraces leaked to user  
app.use(function(err, req, res, next) {  
    res.status(err.status || 500);  
    res.render('error', {  
        message: err.message,  
        error: {}  
    });  
});  

app.get('/*', function(req, res, next) {
    res.sendFile('public/main.html', { root: __dirname });
});


// var x = moment('January 2015').format('YYYY-MM');
// console.log(x);

console.log('Node is now listening at port 3000' + ' host : http://localhost:3000/');
module.exports = app; 