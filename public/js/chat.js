var socket = io();

var scrollToBottom = function(){
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');
	
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();
	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
		jQuery('#messages').scrollTop(scrollHeight);
	}
};


socket.on('connect',function(){
	var param = jQuery.deparam(window.location.search);
	console.log(param);
	socket.emit('join',param, function(err){
		if(err){
			alert(err);
			window.location.href = '/';
		}else{
			console.log('No error');
		}
	});
	
	console.log('Connected to server');
	
//	socket.emit('createMessage', {
//		from: 'jim@example.com',
//		text: 'hey, how is going on'
//	});
	
});

//socket.on('updateRoomList',function(rooms){
//	var option = jQuery('<select></select>');
//	var displayedRoom = [];
//	var occurence = [];
//	rooms.forEach(function(room){
//		if(!displayedRoom.includes(room)){
//			displayedRoom.push(room);
//			occurence.push(1);
//		}else{
//			occurence[displayedRoom.indexOf(room)]++;
//		}
//	});
//	displayedRoom.forEach(function(room){
//		option.append(jQuery('<option></option>').text(room+' Users in the room: '+occurence[displayedRoom.indexOf(room)]));
//	});
//	jQuery('#room-list').html(option);
//	
//});


socket.on('disconnect',function(){
	console.log('Connection lost');
});

socket.on('updateUserList', function(users){
	var ol = jQuery('<ol></ol>');
	
	users.forEach(function(user){
		ol.append(jQuery('<li></li>').text(user));
	});
	
	jQuery('#users').html(ol);
});

socket.on('newMessage', function(message){
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template ,{
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	
	jQuery('#messages').append(html);
	scrollToBottom();
//	console.log('New Message', message);
//	var li = jQuery('<li></li>');
//	li.text(`${message.from} ${formattedTime}: ${message.text}`);
//	
//	jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
//  var li = jQuery('<li></li>');
//  var a = jQuery('<a target="_blank">My current location</a>');
//  var formattedTime = moment(message.createdAt).format('h:mm a');
//
//  li.text(`${message.from} ${formattedTime}: `);
//  a.attr('href', message.url);
//  li.append(a);
//  jQuery('#messages').append(li);
	
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template ,{
		from: message.from,
		createdAt: formattedTime,
		url: message.url
	});
	
	jQuery('#messages').append(html);
	scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
