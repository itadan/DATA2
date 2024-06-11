const Mysql = require('sync-mysql');
const connection = new Mysql({
    host: 'localhost',
    user: 'root',
    password: 'lehacool',
    database: 'ObseDB'
});

const path = require('path');
const fs = require('fs');
const qs = require('querystring');
const http = require('http');

function reqPost(request, response) {
    if (request.method == 'POST') {
        let body = '';

        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            const post = qs.parse(body);
            const sInsert = `INSERT INTO Sector (coordinates, light_intensity, foreign_objects, star_objects_count, unknown_objects_count, defined_objects_count, notes) 
                            VALUES ("${post['coordinates']}", ${post['light_intensity']}, ${post['foreign_objects']}, ${post['star_objects_count']}, ${post['unknown_objects_count']}, ${post['defined_objects_count']}, "${post['notes']}")`;
            const results = connection.query(sInsert);
            console.log('Done. Hint: ' + sInsert);
        });
    }
}

function ViewSelect(res) {
    const query = 'SELECT * FROM Sector';
    const results = connection.query(query);

    res.write('<tr>');
    for (let key in results[0]) {
        res.write('<th>' + key + '</th>');
    }
    res.write('</tr>');

    for (let row of results) {
        res.write('<tr>');
        for (let key in row) {
            res.write('<td>' + row[key] + '</td>');
        }
        res.write('</tr>');
    }
}

function ViewVer(res) {
    const results = connection.query('SELECT VERSION() AS ver');
    res.write(results[0].ver);
}

function JoinTables(res) {
    const query = 'SELECT * FROM Table1 INNER JOIN Table2 ON Table1.id = Table2.table1_id';
    const results = connection.query(query);

    res.write('<tr>');
    for (let key in results[0]) {
        res.write('<th>' + key + '</th>');
    }
    res.write('</tr>');

    for (let row of results) {
        res.write('<tr>');
        for (let key in row) {
            res.write('<td>' + row[key] + '</td>');
        }
        res.write('</tr>');
    }
}

const server = http.createServer((req, res) => {
    reqPost(req, res);
    console.log('Loading...');

    res.statusCode = 200;

    const filePath = path.join(__dirname, 'select.html');
    const array = fs.readFileSync(filePath).toString().split("\n");
    console.log(filePath);
    for (let i in array) {
        if ((array[i].trim() != '@tr') && (array[i].trim() != '@ver') && (array[i].trim() != '@join')) res.write(array[i]);
        if (array[i].trim() == '@tr') ViewSelect(res);
        if (array[i].trim() == '@ver') ViewVer(res);
        if (array[i].trim() == '@join') JoinTables(res);
    }
    res.end();
    console.log('1 User Done.');
});

const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
