$(function() {

	$('.sendNickName').submit(function(e) {
		socket.emit('newGamer',$('.pseudo').val());
	});
});