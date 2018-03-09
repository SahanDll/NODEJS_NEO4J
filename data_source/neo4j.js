var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
var session;

function getSession() {
    session = driver.session();
    console.log('open neo4j session')
    return session;
}

function closeSession(session) {
    console.log('close neo4j session')
    session.close();
}

module.exports.getSession = getSession;
module.exports.closeSession = closeSession;