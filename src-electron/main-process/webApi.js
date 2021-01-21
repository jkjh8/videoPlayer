var express = require('express')
var apiserver = express()
const fs = require('fs')

apiserver.get('/stream',(req, res) => {
  const file = req.query.file
  const filePath = fs.statSync(file)
  const fileSize = filePath.size
  let fileExt
  switch (filePath.ext) {
    case ".mp3":
      fileExt = "audio/mpeg"
      break
    case ".wav":
    case ".flac":
      fileExt = `audio/${filePath.ext.replace(".", "")}`
      break
    case ".ogm":
    case ".ogv":
    case ".ogg":
    case ".webm":
      fileExt = `video/${filePath.ext.replace(".", "")}`
      break
    default:
      fileExt = "video/mp4"
  }
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10): fileSize-1
    const chunksize = (end-start)+1
    const fileStream = fs.createReadStream(file, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    fileStream.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': fileExt,
    }
    res.writeHead(200, head)
    fs.createReadStream(filepath).pipe(res)
  }
})

module.exports = apiserver