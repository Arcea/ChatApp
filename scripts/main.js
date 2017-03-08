$(function() {
	var socket = io.connect();
	var $messageForm = $('#messageForm');
	var $message = $('#message');
	var $chat = $('#chat');
	var $messageArea = $('#messageArea');
	var $userFormArea = $('#userFormArea');
	var $userForm = $('#userForm');
	var $users = $('#users');
	var $usernames = $('#users');
	var $username = $('#username');

	$messageForm.submit(function(e) {
		e.preventDefault();
		socket.emit("send message", $message.val());
		$message.val('');
	});

	var focused = true;

	window.onfocus = function() {
		focused = true;
	};
	window.onblur = function() {
		focused = false;
	};

	socket.on('new message', function(data) {
		$chat.append('<div class="well"><strong>' + data.user + '</strong>: ' + data.msg + '</div>');
		if (focused == false) {
			var audio = new Audio('/audio/notification.mp3');
			audio.play()
		}
	})

	$userForm.submit(function(e) {
		e.preventDefault();
		socket.emit("new user", $username.val(), function(data) {
			if (data) {
				$userFormArea.hide();
				$messageArea.show();
			}
		});
		$username.val('');
	});

	socket.on('get users', function(data) {
		console.log("data " + data);
		var html = '';
		for (var i = 0; i < data.length; i++) {
			html += '<li class="list-group-item">' + data[i] + '</li>';
		}
		$users.html(html);
	})

	socket.on('joined chat', function(user) {
		$chat.append('<div class="well"><strong>' + user + ' joined the chat</strong></div>');
	});

	socket.on('first to join', function(user) {
		$chat.append('<div class="well"<strong>' + 'Welcome ' + user + ' you are the first to join, invite some friends to chat!</strong></div>');
	})
});