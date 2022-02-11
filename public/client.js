let musicIsPlaying = false;
let playbackTime = 0;
let trackDuration = 0;

const socket = io();
socket.on("connect", () => 
{
    console.log("Client connected");
    let searchString;

    document.querySelector('#searchbar').oninput = () =>
    {
        searchString = document.querySelector('#searchbar').value;
        searchString.length == 0 && removeAllChildrenOf(document.querySelector('#searchResults'));
        // searchString.length > 3 && 
        socket.emit("trackSearch", searchString);
    }

    socket.on("searchResults", tracks =>
    {
        removeAllChildrenOf(document.querySelector('#searchResults'));
        let addString = '';
        tracks.forEach(track => {
            addString += 
            `<div id="${track}" onclick="playTrack('${track}.mp3')" class="listedTrack">
                <div class="listedTrack_title" style="font-weight: bold">
                ${track.split(' - ')[1]}
                </div>
                <div class="listedTrack_artists" style="font-weight: light">
                ${track.split(' - ')[0]}
                </div>
            </div>`;
            document.querySelector('#searchResults').innerHTML = addString;
        });
    });

    socket.on("trackSelected", data => 
    {
        let newTrack            = document.createElement('audio');
        newTrack.id             = 'currentTrack';
        newTrack.controls       = 'controls';
        newTrack.type           = 'audio/mpeg';
        newTrack.autoplay       = musicIsPlaying;
        newTrack.src            = './music/' + data.filename;
        newTrack.style          = 'display: none';
        newTrack.ontimeupdate   = timeUpdate;

        document.querySelector('#currentTrack').remove();
        document.querySelector('#currentTrack_container').appendChild(newTrack);
        document.querySelector('#currentTrack_title').innerHTML = data.id3.common.title;
        document.querySelector('#currentTrack_artists').innerHTML = data.id3.common.artists;
        document.querySelector('#currentTrack_album').innerHTML = data.id3.common.album;
        document.querySelector('#currentTrack_duration').innerHTML = timeAsString(data.id3.format.duration);
        trackDuration = data.id3.format.duration;
        document.querySelector('#currentTrack_progressBar').value = 0;
        // let buffer = new Uint8Array(data.id3.common.picture[0].data.Uint8Array);
        // let imageURL = 'data:image/jpeg;base64,' + buffer.toString('base64');
        // document.querySelector('#currentTrack_albumCover').src = imageURL;
        // console.log(imageURL);
    });
});