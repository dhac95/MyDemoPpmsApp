var mysql = require('mysql');  
var connection = mysql.createPool({  
    host: 'localhost',  
    user: 'root',  
    password: '123456',  
    database: 'test'  
});  
console.log('MySQL db is now connected');
module.exports = connection;  