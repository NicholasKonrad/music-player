const path = require("path");
const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const socket = require("socket.io")(http);
const fs = require("fs");
const mm = require('music-metadata');

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => 
{
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

const port = 8080;
http.listen(port, () => console.log("server online :: port ", port));
const musicDirectory = './public/music/';

socket.on("connection", io => 
{
  io.on("trackSearch", searchString => 
  {
    try {
      fs.readdir(musicDirectory, (err, tracks) => 
      {
        if (!err) 
        {
          let results = [];
          tracks.forEach(track =>
            {
              track.split('.mp3')[0].toLowerCase().includes(searchString.toLowerCase()) && results.push(track.split('.mp3')[0]);
            });
          io.emit("searchResults", results);
        }
      });
    } 
    catch (e) { console.log(e); }
  });
  
  io.on("trackSelect", track =>
  {
    try {
      let pathToFile = musicDirectory + track;
      fs.stat(pathToFile, async err => 
      {
        if (!err)
        {
          let id3 = await mm.parseFile(pathToFile);
          io.emit("trackSelected", {filename : track, id3});
        } 
      })
    } 
    catch (e) { console.log(e); }
  });
});