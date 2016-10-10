$(document).ready(function() {
  var socket = io();
  let password = $('#password').text();
  console.log(password)

  $(window).bind('beforeunload', function() {
    socket.emit('delete game', $('#password').text());
    return false;
  });

});
