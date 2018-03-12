var express = require('express');
var router = express.Router();
var neo4j = require('../data_source/neo4j');



/* GET users listing. */
router.get('/', function (req, res, next) {
    var session = neo4j.getSession();
    var main = {};
    var userList = [];
    var login = [];
    var downloaded = [];
    var using = [];
    var view = [];
    var engage = [];
    session
        .run('MATCH (n:User) RETURN n')
        .then(function (result) {
            result.records.forEach(function(record){
                //console.log(record._fields[0].properties);
                userList.push({
                    id: record._fields[0].identity.low,
                    user_id: record._fields[0].properties.user_id,
                })
            });
        });

    session
        .run('MATCH (n:User) WITH n MATCH p=(n)-[*0..1]-(m) RETURN p')
        .then(function (result) {
            //console.log(result);

            result.records.forEach(function(record){
                var root = {};
                var segment = {};
                var start = {};
                var relationship = {};
                var end = {};
                try {
                    root = record._fields[0];
                    segment = root.segments[0];
                    start = segment.start;
                    relationship = segment.relationship;
                    end = segment.end;
                    if (relationship.type === 'Login') {
                        login.push(relationship)
                    }
                    if (relationship.type === 'Downloaded') {
                        downloaded.push(relationship)
                    }
                    if (relationship.type === 'Using') {
                        using.push(relationship)
                    }
                    if (relationship.type === 'View') {
                        view.push(relationship)
                    }
                    if (relationship.type === 'Engage') {
                        engage.push(relationship)
                    }
                } catch (e) {
                }
            });
            neo4j.closeSession(session);
            main.type = 'User_Data';
            main.users = userList;
            main.login = login;
            main.downloaded = downloaded;
            main.using = using;
            main.view = view;
            main.engage = engage;
            res.send(JSON.stringify(main));
        });

});

router.get('/details', function (req, res, next) {
    res.send('respond with user details');
});



module.exports = router;
