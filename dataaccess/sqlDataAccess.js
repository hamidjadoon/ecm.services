const Connection = require('tedious').Connection,
    users = module.exports;


const config = {
    userName: 'sa',
    password: 'qura99',
    server: 'localhost',
    // If you are on Microsoft Azure, you need this:  
    options: { encrypt: false, database: 'mta' }
};
let connection = new Connection(config);

users.RunSQL = function(sql) {
    connection.on('connect', function(err) {
        // If no error, then good to proceed.  
        console.log("Connected");
        executeStatement();
    });
}
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function executeStatement(statement) {
    request = new Request("SELECT * FROM AbpUsers where IsDeleted =0", function(err) {
        if (err) {
            console.log(err);
        }
    });
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    request.on('done', function(rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}



// function executeStatement1() {
//     request = new Request("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES (@Name, @Number, @Cost, @Price, CURRENT_TIMESTAMP);", function(err) {
//         if (err) {
//             console.log(err);
//         }
//     });
//     request.addParameter('Name', TYPES.NVarChar, 'SQL Server Express 2014');
//     request.addParameter('Number', TYPES.NVarChar, 'SQLEXPRESS2014');
//     request.addParameter('Cost', TYPES.Int, 11);
//     request.addParameter('Price', TYPES.Int, 11);
//     request.on('row', function(columns) {
//         columns.forEach(function(column) {
//             if (column.value === null) {
//                 console.log('NULL');
//             } else {
//                 console.log("user id of inserted item is " + column.value);
//             }
//         });
//     });
//     connection.execSql(request);
// }