var express = require('express');
var router = express.Router();
var neo4j = require('../data_source/neo4j');
var jwt    = require('jsonwebtoken');
var config = require('../config');

router.post('/', function (req, res) {
    var session = neo4j.getSession();
    var main = {};
    session
        .run('MATCH (n:AuthUser {userName: "' + req.body.userName + '"}) RETURN n')
        .then(function (result) {
            console.log(result.records[0]._fields[0].properties);
            if (!result.records[0]) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (result.records[0]) {
                if (result.records[0]._fields[0].properties.password !== req.body.password) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                } else {
                    const payload = {
                        userName: result.records[0]._fields[0].properties.userName,
                        role: result.records[0]._fields[0].properties.role
                    };
                    var token = jwt.sign(payload, config.secret, {
                        expiresIn : 60*60
                        /*expiresIn : 60*60*24*/
                    });

                    res.json({
                        success: true,
                        message: 'Authentication success.',
                        token: token,
                        expires: 60*60
                    });
                }
            }
            neo4j.closeSession(session);
        });
});


module.exports = router;
