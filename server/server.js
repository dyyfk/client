const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var rooms = [];
app.use(express.static(publicPath));


io.on('connection', (socket) => {
	
	socket.emit('updateRoomList',rooms);
	socket.on('join', (params,callback)=>{
		if(!isRealString(params.name) || (!isRealString(params.roomJoined)&&!isRealString(params.roomCreated))){
			return callback('Name and room name are required');
		}
		if(isRealString(params.roomCreated)&& isRealString(params.roomJoined)){
			return callback('Can only join an existing room or create a new one');
		}
		var roomSelected = params.roomJoined || params.roomCreated;
		socket.join(roomSelected);

		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, roomSelected);
		
		io.to(roomSelected).emit('updateUserList', users.getUserList(roomSelected));
		
		rooms.push(roomSelected);
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  		socket.broadcast.to(roomSelected).emit('newMessage', generateMessage('Admin', params.name + ' has joined'));

		callback();
	});

  socket.on('createMessage', (message, callback) => {
	var user = users.getUser(socket.id);
	if(user&&isRealString(message.text)){
		io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
	}
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
	var user = users.getUser(socket.id);
	if(user){
		io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
	}
  });

  socket.on('disconnect', () => {
	  var user = users.removeUser(socket.id);
	  if(user){
		rooms.splice(rooms.indexOf(user.room),1);
		io.to(user.room).emit('updateUserList', users.getUserList(user.room));
	  	io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
	  }

  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
