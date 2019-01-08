const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const {generatedMessage} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket)=>{
	console.log('New users connected');
	
	
	socket.emit('newMessage', generatedMessage('Admin', 'Welcome to the chat room')); 
	socket.broadcast.emit('newMessage',generatedMessage('Admin', 'A new user joined'));
//	socket.emit('newMessage',{
//		from: 'example@qq.com',
//		text: 'Hey what s going on',
//		createAt: 12.30,
//	});
	socket.on('createMessage',(message, callback)=>{
		console.log('Message created', message);
//		io.emit('newMessage',{
//			from: message.from,
//			text: message.text,
//			createAt: new Date().getTime()
//		});
		io.emit('newMessage',generatedMessage(message.from, message.text));
		callback('This text is from server');
	});
	
	socket.on('disconnect',()=>{
		console.log('User disconnected');
	});
});

app.use(express.static(publicPath));

server.listen(port,()=>{
	console.log(`listening to the port ${port}`);
});