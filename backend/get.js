let http = require('http');
let url = require("url");

http.createServer(function (request, response) {
    let names = "";
    const mysql = require("mysql");
    const con = mysql.createPool({
        host: "localhost",
        user: "Admin",
        password: "Admin123Admin123",
        database: "labs"
    });

    con.getConnection(function(err, connection) {
        if (err) throw err;

        console.log("connected");
        let sql = "SELECT * FROM quiz";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            names += "[ ";
            for (let i = 0; i < result.length; i++) {
                names += "{";
                names = names.concat('"questionNumber": "' + result[i].id + '",\n');
                names = names.concat('"q": "' + result[i].question + '",\n');
                names = names.concat('"a1": ' + result[i].answer1 + ",\n");
                names = names.concat('"a2": ' + result[i].answer2 + ",\n");
                names = names.concat('"a3": ' + result[i].answer3 + ",\n");
                names = names.concat('"a4": ' + result[i].answer4 + ",\n");
                names = names.concat('"answerIndex": ' + result[i].answerIndex + "\n");
                names += "},";
            }
            names = names.slice(0, -1) + "]\n";
            response.writeHead(200, {'Content-type': 'text/html', "Access-Control-Allow-Origin": "*"});
            response.end(names);
        });
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (err) throw error;
    });
}
).listen(process.env.PORT || 8080);
console.log('listening ...');
