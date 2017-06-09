var config = require('config');
var router = require('express').Router();
//var TYPES = require('tedious').TYPES;

let sql = require('mssql'),
    TYPES = require('mssql').TYPES;

const dbConfig = {
    user: 'ECM',
    password: 'P@ssw0rd',
    server: 'TEO-HAMID', // You can use 'localhost\\instance' to connect to named instance 
    database: 'HLJ_ExformaticsDB',

    options: {
        encrypt: false // Use this if you're on Windows Azure 
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

const dbConnectionStr = config.get("connection");
console.log(dbConnectionStr);

// new sql.ConnectionPool(dbConfig).connect().then(pool => {
//     return pool.query `select * from DL_D610 where DL_Id = ${1067}`;
// }).then(result => {
//     console.dir(result)
// }).catch(err => {
//     if (err) {
//         console.log(err.message);

//     }
// })



const executeQuery = function(res, query) {
    const pool = new sql.ConnectionPool(dbConfig, (err) => {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.send(err);
        }
        pool.request().query(query, (err, result) => {
            if (err) {
                console.log("Error while querying database :- " + err);
                res.send(err);
            } else {
                console.log(res);
                res.send(result);
            }
        });
    });

    //pool.close();
}


router.get('/entities', (req, res) => {
    if (!req.query.entityName) {
        res.send('Error! entityName must be specified');
    }

    const entityParams = {
        entityName: req.query.entityName,
        where: req.query.where,
        columns: req.query.columns,
        orderBy: req.query.orderBy
    };

    const query = `select  * from DL_D610 where DL_EntityName='${req.query.entityName}' for json path`;
    console.log(query);
    //res.send(entityParams);
    executeQuery(res, query);
});

/* GET single task. */
// router.get('/entities/:id', (req, res) => {
//     console.log('route with id');
//     const query = `select * from DL_D610 where Id = ${req.params.id} for json path`;
//     executeQuery(res, query);

// });

/* POST create task. */
router.post('/entities', (req, res) => {

    req.query("exec createEntity @entity")
        .param('entity', req.body, TYPES.NVarChar)
        .exec(res);

});

/* PUT update task. */
router.put('/entities/:id', (req, res) => {

    req.query("exec updateEntity @id, @entity")
        .param('id', req.params.id, TYPES.Int)
        .param('entity', req.body, TYPES.NVarChar)
        .exec(res);

});

/* DELETE single task. */
router.delete('/entities/:id', (req, res) => {

    req.query("delete from DL_D610 where DL_Id = @id")
        .param('id', req.params.id, TYPES.Int)
        .exec(res);

});

module.exports = router;