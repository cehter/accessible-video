/*variables*/
var video            = document.getElementById('video');
var playPauseButton  = document.getElementById('playPauseButton');
var muteButton       = document.getElementById('muteButton');
var fullscreenButton = document.getElementById('sizeButton');
var changeProgress   = document.getElementById('progressbar');
var changeVolume     = document.getElementById('volumebar');
var timeDisplay      = document.getElementById('time');
var transcript       = document.getElementById('transkiptionEnvironment');
var cues             = document.getElementsByClassName("cue")
var transcriptButton = document.getElementById('transkiptionButton');

var textTracks = video.textTracks;

/*constant*/
var KEY_ENTER = 13;
var KEY_S     = 83;
var KEY_Z     = 90;
var KEY_V     = 86;
var KEY_F     = 70;


/*Add EventListener*/
playPauseButton.addEventListener('click', playPause, false);
muteButton.addEventListener('click', mute, false);
fullscreenButton.addEventListener('click', fullscreen, false);
changeProgress.addEventListener('change', changeProgressEventListener, false);
video.addEventListener('timeupdate', updateProgressbar, false);
changeVolume.addEventListener('change', changeVolumeValue, false);
transcriptButton.addEventListener('click', showTransciption, false);

video.addEventListener("timeupdate", textChange, false);


/*Funktion to start and stop the video*/
function playPause() {
    if (video.paused) {
        playPauseButton.childNodes[0].nodeValue = "Stop"
        video.play();
    } else {
        playPauseButton.childNodes[0].nodeValue = "Start";
        video.pause();
    }
}

/*Video jumps 20 seconds forth and back*/
function forward() {
    video.currentTime = video.currentTime + 20;
}
function backward() {
    video.currentTime = video.currentTime - 20;
}

/*Mute the sound*/
function mute() {
    if (video.muted) {
        muteButton.childNodes[0].nodeValue = "Ton aus";
        video.muted                        = false;
    }
    else  {
        muteButton.childNodes[0].nodeValue = "Ton an";
        video.muted                        = true;
    }
}

/*Loads the selected video*/
function playSelectedVideo(selectedObj) {
    var source = "../videos/" + selectedObj.options[selectedObj.selectedIndex].value;
    video.src = source;
    video.load();
}

/*Loads the selecte subtitle*/
function showSelectedTrack(selectedObj) {
    selectedObjectValue = selectedObj.options[selectedObj.selectedIndex].value
    for (i = 0; i < textTracks.length; i++) {
        if (textTracks[i].label == selectedObjectValue ) {
            textTracks[i].mode = "showing";
        }
        else {
            if (textTracks[i].kind == "subtitles") {
                textTracks[i].mode = "disabled";
            }
        }
    }
}

/*Loads the selecte audiodescription*/
function showSelectedDesciption(selectedObj) {
    selectedObjectValue = selectedObj.options[selectedObj.selectedIndex].value
    for (i = 0; i < textTracks.length; i++) {
        if (textTracks[i].label == selectedObjectValue ) {
            textTracks[i].mode = "showing";
        } 
        else {
            if (textTracks[i].kind == "descriptions") {
                textTracks[i].mode = "disabled";
            }
        }
    }
}

/*Loads the selecte captions*/
function showSelectedCaptions(selectedObj) {
    selectedObjectValue = selectedObj.options[selectedObj.selectedIndex].value
    for (i = 0; i < textTracks.length; i++) {
        if (textTracks[i].label == selectedObjectValue ) {
            textTracks[i].mode = "showing";
        } 
        else {
            if (textTracks[i].kind == "captions") {
                textTracks[i].mode = "disabled";
            }
        }
    }
}

/*Fullscreen*/
function fullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } 
    else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();    // Firefox
    } 
    else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); // Chrome and Safari
    }
}
/*Change the progressbar*/
function changeProgressEventListener() {
    var time = changeProgress.value;
    changeProgressValue(time);
}
function changeProgressValue(changeTime) {
    console.log("changeTime: " + changeTime + " duration " + video.duration + " current:" + video.currentTime)
    var time          = video.duration * (changeTime / 100);
    video.currentTime = time;
}

/*Update the progressbar*/
function updateProgressbar() {
    var value            = (100 / video.duration) * video.currentTime;
    changeProgress.value = value;
}

/*Change Volume*/
function changeVolumeValue() {
    video.volume = changeVolume.value;
}

/*Set the current time and the duration of the video every second*/
setInterval(function() {
    if (!isNaN(video.duration)) {
        var videoTime     = document.createTextNode(buildTimeString());
        var videoTimeNode = timeDisplay.childNodes[0];
        timeDisplay.appendChild(videoTime);
        timeDisplay.removeChild(videoTimeNode);
        timeDisplay.appendChild(videoTime);
    }
}, 1000);
function buildTimeString() {
    var timeString = changeTimeFormat(video.currentTime) + " | " + changeTimeFormat(video.duration);
    return timeString;
}

/*Change timeformat from seconds to mm:ss*/
function changeTimeFormat(sec) {
    seconds = Math.round(sec);
    min     = Math.floor(sec / 60);
    minutes = (min >= 10) ? min : "0" + min;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}

/*Keycontrols for the video*/
document.onkeydown=function(e) {
    var valueToInt = parseInt(changeProgress.value);
    if ((e.keyCode || e.which) == KEY_S) {
        playPause();
    }
    else if ((e.keyCode || e.which) == KEY_Z) {
        var backward = valueToInt - 1;
        changeProgressValue(backward.toString());
    }
    else if ((e.keyCode || e.which) == KEY_V) {
        var forward = valueToInt  + 1;
        changeProgressValue(forward.toString());
    }
    else if ((e.keyCode || e.which) == KEY_F) {
        //Fullscreen
        if (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen) {
            document.webkitCancelFullScreen();
        }
        else {
            fullscreen();
        } 
    }
}

/*Reads the cues and puts them in a paragraph environment*/
function cuesList() {
    for (var i = 0; i < textTracks.length; i++) {
        if (textTracks[i].label == "german sub") {
            var html      = "";
            var textTrack = textTracks[i];
            for (var j = 0; j < textTrack.cues.length; j++) {
                var cue = textTrack.cues[j];
                var p   = document.createElement('p');
                p.setAttribute('class', 'cue');
                p.setAttribute('data-time', cue.startTime);
                p.setAttribute('tabindex', '1');
                p.appendChild(document.createTextNode(cue.text));
                transcript.appendChild(p);
            }
            break;
        }
    }
}

/*Colors the cues and shows them on top of the list*/
function textChange() {
    for (i=0; i<cues.length; i++) {
        if (video.currentTime >= parseFloat(cues[i].getAttribute("data-time")) &&
            video.currentTime < parseFloat(cues[i+1].getAttribute("data-time"))) {
            transcript.scrollTop = cues[i].offsetTop - transcript.offsetTop;
            cues[i].id           = "current";
        }
    }
}

/*Adds to each cue an EventListener*/
function showTransciption() {
    cuesList();
    for (i=0; i<cues.length; i++) {
        cues[i].addEventListener("click", jumpToDataTime , false);
        cues[i].addEventListener("keydown", keyFunktion, false);

    }
}
function jumpToDataTime() {
    var start         = parseFloat(event.srcElement.getAttribute("data-time"));
    video.currentTime = start;
    video.play();
}
function keyFunktion() {
    if (event.keyCode == KEY_ENTER) {
        jumpToDataTime();
    }
}
