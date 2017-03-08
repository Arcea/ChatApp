var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = require('./host');
var portfinder = require('portfinder');
var chatHelper = require('./helpers/chatHelpers');

var users = [];
var connections = [];
var localPort = portfinder.basePort;


if(localPort != port){
	server.listen(process.env.PORT || process.argv[2] || port);
	console.log("Server up");
} else {
	var newPort = localPort + 1;
	server.listen(process.env.PORT || process.argv[2] || newPort);
	console.log("Server up with a different port");
	console.log("The new port is: " + newPort);
}

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
		if (data.trim() == '') {
			data = "Ik ben een idioot die berichten verzend zonder iets in te vullen";
		}
		data = chatHelper.imageShow(data);
		io.sockets.emit('new message', {
			msg: data,
			user: socket.username
		})
	})

	socket.on("new user", function(data, callback) {
		if (data.trim() == '') {
			data = "XxPussySlayer69xX";
		}
		for (var i = 1; i <= users.length; i++) {
			if (users[i - 1] == data) {
				data = data + i;
			}
		}
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUserNames();
	});

	function updateUserNames() {
		io.sockets.emit('get users', users);
	}
});