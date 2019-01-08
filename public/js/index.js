var socket = io();

socket.on('connect',function(){
	console.log('Connected to server');
	
	socket.emit('createMessage', {
		from: 'jim@example.com',
		text: 'hey, how is going on'
	});
});

socket.on('disconnect',function(){
	console.log('Connection lost');
});

socket.on('newMessage', function(message){
	console.log('New Message', message);
});