$(document).ready(function() {
  var socket = io();

  $('#joinForm').submit(function() {
    socket.emit('player name', {
      name:$('#playerName').val(),
      password:$('#gamePassword').val()
    });
    return false;
  });

  function serverUpdate() {
    console.log("panda");
    $.ajax({
      type: "POST",
      url: "/join",
      data: {name: $('#playerName').val(),
      password: $('#gamePassword').val()},
      succcess: function() {
        console.log("succcess");
      },
      error: function() {
        console.log("error")
      }
    });
  }

  //$('#playerName').val() = '';
  //$('#gamePassword').val() = '';

  socket.on('player name', function(name) {
    serverUpdate();
    $('#playerList').append($('<li>').text(name));
  });
});
