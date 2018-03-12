var express = require('express');
var router = express.Router();
var neo4j = require('../data_source/neo4j');



/* GET users listing. */
router.get('/', function (req, res, next) {
    var session = neo4j.getSession();
    var main = {};
    var userList = [];
    session
        .run('MATCH (n:AuthUser) RETURN n')
        .then(function (result) {
            console.log(result);

            result.records.forEach(function(record){
                //console.log(record._fields[0].properties);
                userList.push({
                    id: record._fields[0].identity.low,
                    userName: record._fields[0].properties.userName,
                    password: record._fields[0].properties.password,
                    role: record._fields[0].properties.role
                })
            });
            neo4j.closeSession(session);
            main.type = 'Auth_Users';
            main.data = userList;
            res.send(JSON.stringify(main));
        });

});

module.exports = router;
