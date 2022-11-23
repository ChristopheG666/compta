const http = require("http");
const { URL } = require('url');
const { parse: parseQuery } = require('querystring');

const fs = require('fs');

const host = '0.0.0.0';
const port = 8088;
const index_filename = 'index.html';
const compa_filename = 'compta.json';
const serverOrigin = 'http://' + host + ':' + port;

const requestListener = function(req, res) {
    console.log(req.url);
    const url = new URL(req.url, serverOrigin);
    //console.log(url);

    // Parse the URL query. The leading '?' has to be removed before this.
    const query = parseQuery(url.search.substr(1));
    //console.log(query);

    try {
        switch (url.pathname) {
            case "/":
                {
                    const contents = fs.readFileSync(__dirname + "/" + index_filename);
                    res.writeHead(200);
                    res.end(contents);
                    break;
                }
            case "/read":
                {
                    const contents = fs.readFileSync(__dirname + "/" + compa_filename);
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(200);
                    res.end(contents);
                    break;
                }
            case "/save":
                {
                    res.writeHead(200);

                    const json = JSON.parse(query.json);
                    fs.writeFileSync(compa_filename, JSON.stringify(json));

                    res.end("Save Ok");
                    break;
                }
            case "/add":
                {
                    res.writeHead(200);

                    const json = JSON.parse(query.json);
                    // Read the current compta and add the expense
                    const contents = fs.readFileSync(__dirname + "/" + compa_filename);
                    expense = JSON.parse(contents);
                    expense.expense.unshift(json);
                    fs.writeFileSync(compa_filename, JSON.stringify(expense));

                    res.end("Save Ok");
                    break;
                }
            case "/delete":
                {
                    res.writeHead(200);

                    const json = JSON.parse(query.json);
                    // Read the current compta and add the expense
                    const contents = fs.readFileSync(__dirname + "/" + compa_filename);
                    expense = JSON.parse(contents);
                    // Erase the id
                    //console.log(json);
                    for (var i = 0; i < expense.expense.length; i++) {
                        // console.log(expense.expense[i].id );
                        if (expense.expense[i].id === json) {
                            var spliced = expense.expense.splice(i, 1);
                            //console.log("Removed element: " + JSON.stringify(spliced));
                            //console.log("Remaining elements: " + JSON.stringify(expense.expense));
                        }
                    }
                    fs.writeFileSync(compa_filename, JSON.stringify(expense));

                    res.end("Save Ok");
                    break;
                }
            default:
                {
                    const filepath = __dirname + "/" + url.pathname;
                    try {
                        const contents = fs.readFileSync(filepath);
                        res.writeHead(200);
                        res.end(contents);
                    } catch (error) {
                        console.error(error);
                        res.writeHead(404);
                        res.end("Document not found");
                    }
                    break;
                }
        }
    } catch (error) {
        console.error(error);
        res.writeHead(404);
        res.end("Document not found");
    };
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
