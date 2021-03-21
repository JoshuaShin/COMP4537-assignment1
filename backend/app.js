let http = require('http');
let url = require("url");

const handleGet = (response, connection) => {
    let sql = "SELECT * FROM quiz";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        let names = "[ ";
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
        console.log("Returned quiz questions");
        names = names.slice(0, -1) + "]\n";
        response.writeHead(200, {'Content-type': 'text/html', "Access-Control-Allow-Origin": "*"});
        response.end(names);
    });
}

const handlePostNew = (parsedURL, response, connection) => {
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

    let sql = "INSERT INTO quiz(question, answer1, answer2, answer3, answer4, answerIndex) values ("
                + parsedURL.query["question"] + ", "
                + parsedURL.query["answer1"] + ", "
                + parsedURL.query["answer2"] + ", "
                + parsedURL.query["answer3"] + ", "
                + parsedURL.query["answer4"] + ", "
                + parsedURL.query["answerIndex"] + ")";
        connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("1 record inserted");
        response.writeHead(200, {'Content-type': 'text/html', "Access-Control-Allow-Origin": "*"});
        response.end(parsedURL.query["question"] + " stored in DB.");
    });
}

const handlePostDelete = (parsedURL, response, connection) => {
    let sql = "DELETE FROM quiz WHERE id = " + parsedURL.query["id"];
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log('1 record deleted');
        response.writeHead(200, {'Content-type': 'text/html', "Access-Control-Allow-Origin": "*"});
        response.end("Question " + parsedURL.query["id"] + " deleted from DB.");
    });
}

const handlePut = (parsedURL, response, connection) => {
    let sql = "UPDATE quiz SET "
                + "question = " + parsedURL.query["question"] + ", "
                + "answer1 = " + parsedURL.query["answer1"] + ", "
                + "answer2 = " + parsedURL.query["answer2"] + ", "
                + "answer3 = " + parsedURL.query["answer3"] + ", "
                + "answer4 = " + parsedURL.query["answer4"] + ", "
                + "answerIndex = " + parsedURL.query["answerIndex"] + " "
                + "WHERE id = " + parsedURL.query["id"];
        console.log(sql);
        connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("1 record updated");
        response.writeHead(200, {'Content-type': 'text/html', "Access-Control-Allow-Origin": "*"});
        response.end("Question " + parsedURL.query["id"] + " updated in DB.");
    });
}

http.createServer(function (request, response) {
    let parsedURL = url.parse(request.url, true);
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

        if (request.method === "GET") {
            handleGet(response, connection);
        }else if (request.method === "POST") {
            if (parsedURL.query["id"]) {
                handlePostDelete(parsedURL, response, connection);
            } else {
                handlePostNew(parsedURL, response, connection);
            }
        } else if (request.method === "PUT") {
            handlePut(parsedURL, response, connection);
        }

        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (err) throw error;
    });
}
).listen(process.env.PORT || 8080);
console.log('listening at port 8080...');
