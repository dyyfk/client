var socket = io();

socket.on('connect',function(){
	console.log('Connected to server');
	
//	socket.emit('createMessage', {
//		from: 'jim@example.com',
//		text: 'hey, how is going on'
//	});
	
});

socket.on('disconnect',function(){
	console.log('Connection lost');
});

socket.on('newMessage', function(message){
	console.log('New Message', message);
});

socket.emit('createMessage', {
	from: 'Frank',
	text: 'Hello, goodbye'
},function(serverMessage){
	console.log('Got it', serverMessage);
});

jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	
	socket.emit('createMessage',{
		from: 'User',
		text: jQuery('[name=message]').val()
	},function(){
		
	});
});