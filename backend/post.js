let http = require('http');
let url = require("url")

http.createServer(function (request, response) {
    let q = url.parse(request.url, true);
    const mysql = require("mysql");
    const con = mysql.createPool({
        host: "localhost",
        user: "Admin",
        password: "Admin123Admin123",
        database: "labs"
    });

    con.getConnection(function(err, connection) {
        if (err) throw err;

        const createTableQuery = [
            'CREATE TABLE IF NOT EXISTS quiz',
            '(id INT AUTO_INCREMENT PRIMARY KEY,',
            'question VARCHAR(255),',
            'answer1 VARCHAR(255),',
            'answer2 VARCHAR(255),',
            'answer3 VARCHAR(255),',
            'answer4 VARCHAR(255),',
            'answerIndex INT)'
        ].join(' ');
        connection.query(createTableQuery, (err, result) => {
            if (err) throw err;
            console.log('Table created');
        });

        console.log("connected");
        let sql = "INSERT INTO quiz(question, answer1, answer2, answer3, answer4, answerIndex) values ("
                    + q.query["question"] + ", "
                    + q.query["answer1"] + ", "
                    + q.query["answer2"] + ", "
                    + q.query["answer3"] + ", "
                    + q.query["answer4"] + ", "
                    + q.query["answerIndex"] + ")";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (err) throw error;
    });
        console.log("server received req");
        response.writeHead(200, {'Content-type': 'text/html', "Access-Control-Allow-Origin": "*"});
        response.end(q.query["question"] + " stored in DB.");
    }
).listen(process.env.PORT || 8080);
console.log('listening ...');
