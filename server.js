var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.PORT || process.argv[2] || 8000);
console.log("Server up");

app.use(express.static(__dirname, {
	extensions: ['html', 'js', 'css']
}));


io.sockets.on('connection', function(socket) {
	connections.push(socket);
	console.log("Users connected:", connections.length);

	socket.on("disconnect", function(data) {
		users.splice(users.indexOf(socket.username), 1);
		updateUserNames();
		connections.splice(connections.indexOf(socket), 1);
		console.log("User disconnected. Connections remaining:", connections.length);
	});

	socket.on("send message", function(data) {
		io.sockets.emit('new message', {
			msg: data,
			user: socket.username
		})
	})

	socket.on("new user", function(data, callback) {
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUserNames();
	});

	function updateUserNames() {
		io.sockets.emit('get users', users);
	}
});