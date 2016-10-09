console.log("panda");
var socket = io();

$('#joinForm').submit(function() {
  socket.emit('player name', $('#playerName').val());
  return false;
});

socket.on('player name', function(name) {
  console.log(name);
  $('#playerList').append($('<li>').text(name));
  $('#playerList').append($('<li>').text("fLKFDjLSFKJLSDKFJSLF"));
});
