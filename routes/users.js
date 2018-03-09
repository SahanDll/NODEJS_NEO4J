var express = require('express');
var router = express.Router();
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
var session = driver.session();


/* GET users listing. */
router.get('/', function (req, res, next) {
    session
        .run('MATCH (n:User) RETURN n')
        .then(function (result) {
            var userList = [];
            console.log(result);

            result.records.forEach(function(record){
                console.log(record._fields[0].properties);
                userList.push({
                    id: record._fields[0].identity.low,
                    user_id: record._fields[0].properties.user_id
                })
            });
            res.send(userList);
        });

});

router.get('/details', function (req, res, next) {
    res.send('respond with user details');
});



module.exports = router;
