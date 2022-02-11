function removeAllChildrenOf(element)
{
    while (element.lastChild) 
    {
        element.removeChild(element.lastChild);
    }
}

function timeUpdate()
{
    playbackTime = document.querySelector('#currentTrack').currentTime;
    document.querySelector('#currentTrack_timePlayed').innerHTML = timeAsString(playbackTime);
    document.querySelector('#currentTrack_progressBar').value = (playbackTime/trackDuration)*1000;
}

function playNext() 
{
    console.log("will play next");
}

function togglePlayState()
{
    musicIsPlaying = !musicIsPlaying;
    if (musicIsPlaying)
    {
        document.querySelector('#currentTrack').pause();
        document.querySelector('#playPause').innerHTML = '⯈';
    }
    else
    {
        document.querySelector('#currentTrack').play();
        document.querySelector('#playPause').innerHTML = '❘❘';
    }
}

function playTrack(track)
{
    socket.emit("trackSelect", track);
}

function timeAsString(t)
{
    let minutes = Math.floor(t/60);
    let hours = Math.floor(minutes/60);
    let seconds = Math.floor(t-minutes*60);
    seconds = (seconds <= 9) ? '0'+seconds : seconds;
    return hours == 0 ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}