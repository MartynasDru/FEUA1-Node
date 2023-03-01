const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/products') {
        res.end(JSON.stringify([
            { name: 'Gitara', price: 100 },
            { name: 'Smuikas', price: 300 }
        ]));
        return;
    }

    if (req.url === '/users') {
        res.end(JSON.stringify([
            { name: 'Petras', email: 'petras123@gmail.com' },
            { name: 'Antanas', email: 'antanas@gmail.com' }
        ]));
        return;
    }

    res.setHeader('Content-Type', 'plain/text');
    res.end('Endpoint does not exist');
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server started');
});