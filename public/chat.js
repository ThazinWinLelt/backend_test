// Make connection
var socket = io.connect("http://localhost:4000");

// Query DOM
// var message = document.getElementById("message"),
//   handle = document.getElementById("handle"),
//   btn = document.getElementById("send"),
//   output = document.getElementById("output"),
//   feedback = document.getElementById("feedback");

// Emit events
// btn.addEventListener("click", function() {
//   socket.emit("chat", {
//     message: message.value,
//     handle: handle.value
//   });
//   message.value = "";
// });

// message.addEventListener("keypress", function() {
//   socket.emit("typing", handle.value);
// });

// Listen for events
// socket.on("chat", function(data) {
//   feedback.innerHTML = "";
//   output.innerHTML +=
//     "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
// });

// socket.on("typing", function(data) {
//   feedback.innerHTML = "<p><em>" + data + " is typing a message...</em></p>";
// });

////////
var tag = document.createElement("script");
// tag.id = "iframe-demo";
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var player;
// function onYouTubeIframeAPIReady() {
//   console.log("ready");
//   player = new YT.Player("existing-iframe-example", {
//     events: {
//       onReady: onPlayerReady,
//       onStateChange: onPlayerStateChange
//     }
//   });
// }

// function onPlayerReady(event) {
//   console.log("start");
//   document.getElementById("existing-iframe-example").style.borderColor =
//     "#FF6D00";
// }
// function changeBorderColor(playerStatus) {
//   var color;
//   if (playerStatus == -1) {
//     color = "#37474F"; // unstarted = gray
//   } else if (playerStatus == 0) {
//     color = "#FFFF00"; // ended = yellow
//   } else if (playerStatus == 1) {
//     console.log("play");
//     //console.log(player.getCurrentTime());
//     socket.emit("play", player.getCurrentTime());
//     color = "#33691E"; // playing = green
//   } else if (playerStatus == 2) {
//     console.log("paused");
//     color = "#DD2C00"; // paused = red
//   } else if (playerStatus == 3) {
//     color = "#AA00FF"; // buffering = purple
//   } else if (playerStatus == 5) {
//     color = "#FF6DOO"; // video cued = orange
//   }
//   if (color) {
//     document.getElementById(
//       "existing-iframe-example"
//     ).style.borderColor = color;
//   }
// }
// function onPlayerStateChange(event) {
//   changeBorderColor(event.data);
// }

// socket.on("play", function(data) {
//   console.log("now playing");
//   console.log(data);
//   player.seekTo(data);
//   player.playVideo();
// });

var player,
  time_update_interval = 0;
var flag = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("video-placeholder", {
    width: 600,
    height: 400,
    videoId: "M7lc1UVf-VE",
    events: {
      onReady: initialize,
      onStateChange: onPlayerStateChange
    }
  });
}

function initialize() {
  console.log("initialize");
  // Clear any old interval.
  clearInterval(time_update_interval);
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !flag) {
    socket.emit("play", player.getCurrentTime());
    flag = true;
  } else if (event.data == YT.PlayerState.PAUSED) {
    socket.emit("pause");
    flag = false;
  }
}

var play = document.getElementById("play");
var pause = document.getElementById("pause");

play.addEventListener("click", function(event) {
  socket.emit("play", player.getCurrentTime());
});

pause.addEventListener("click", function(event) {
  socket.emit("pause");
});

socket.on("play", function(data) {
  console.log("now playing");
  console.log(data);
  player.playVideo();
  player.seekTo(data);
});

socket.on("pause", function() {
  console.log("now pause");
  player.pauseVideo();
});
