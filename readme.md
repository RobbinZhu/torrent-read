# torrent-read

Read and parse a torrent file from buffer

	npm install torrent-read

## Usage

``` js
//read from file
var TorrentRead = require('torrent-read');
var fs = require('fs');

fs.readFile('./5477B6CD394A690C45FBC8E8939757A958D70245.torrent', function(err, data) {
  TorrentRead(data);
});
```

``` js
//read from web
var TorrentRead = require('torrent-read'),
    http = require('http'),
    zlib = require('zlib');

function loadTorrent(url, callback) {
  http.get(url, function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
          callback(err, decoded);
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function(err, decoded) {
          callback(err, decoded);
        })
      } else {
        callback(null, buffer);
      }
    });
  }).on('error', callback);
}

loadTorrent('http://torcache.net/torrent/5477B6CD394A690C45FBC8E8939757A958D70245.torrent', function(e, data){
  TorrentRead(data);
});
```

The torrent result looks like this:

``` js
{
  "announce": "udp://open.demonii.com:1337/announce",
  "announce-list": [
    ["udp://open.demonii.com:1337/announce"],
    ["udp://tracker.publicbt.com:80/announce"],
    ["udp://tracker.openbittorrent.com:80/announce"],
    ["udp://tracker.istole.it:80/announce"],
    ["udp://coppersurfer.tk:6969/announce"],
    ["udp://tracker.publichd.eu:80/announce"],
    ["udp://9.rarbg.com:2710/announce"],
    ["http://tracker.torrentfrancais.com/announce"],
    ["udp://9.rarbg.me:2710/announce"]
  ],
  "comment": "Torrent downloaded from torrent cache at http://torcache.net/",
  "created by": "uTorrent/2210",
  "creation date": "1418824623",
  "encoding": "UTF-8",
  "info_hash": "5477B6CD394A690C45FBC8E8939757A958D70245",
  "info": {
    "files": [{
      "length": "115294",
      "path": ["Subs", "(eng)I Origins 2014 720p WEB-DL x264 AC3-JYK.srt"]
    }, {
      "length": "112067",
      "path": ["Subs", "I Origins 2014 720p WEB-DL x264 AC3-JYK.smi"]
    }, {
      "length": "2541229476",
      "path": ["I Origins 2014 720p WEB-DL x264 AC3-JYK.mkv"]
    }, {
      "length": "103692",
      "path": ["I Origins 2014 720p WEB-DL x264 AC3-JYK.mkv.jpg"]
    }],
    "name": "I Origins 2014 720p WEB-DL x264 AC3-JYK",
    "piece length": "4194304"
  }
}
```