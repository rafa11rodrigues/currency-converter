const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const vueConfig = require('./vue.config');

const app = express();
app.use('/', serveStatic(path.join(__dirname, '/dist')));
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const port = process.env.PORT || vueConfig.devServer.port || 4200;

app.listen(port);
console.log(`server is listening on port ${port}`);

