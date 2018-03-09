var express = require('express');
var router = express.Router();
var neo4j = require('../data_source/neo4j');



/* GET users listing. */
router.get('/', function (req, res, next) {
    var session = neo4j.getSession();
    session
        .run('MATCH (n:User) RETURN n')
        .then(function (result) {
            var userList = [];
            //console.log(result);

            result.records.forEach(function(record){
                console.log(record._fields[0].properties);
                userList.push({
                    id: record._fields[0].identity.low,
                    user_id: record._fields[0].properties.user_id
                })
            });
            neo4j.closeSession(session);
            res.send(userList);
        });

});

router.get('/details', function (req, res, next) {
    res.send('respond with user details');
});



module.exports = router;
