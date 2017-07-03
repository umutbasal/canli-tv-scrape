const express = require("express")
const request = require("request")
const fs = require('fs')

const app = express()

let ch = require("./jsonChannels")

app.disable("x-powered-by")

app.use(express.static('public'))

/* PUBLIC API*/
app.get('/', (req, res) => {
  res.json({msg:"go /channelName or /list/m3u8"})
})

app.get('/:channel', (req, res) => {
  res.json({msg:"/channelName/info or /channelName/watch"})
})

app.get("/:channel/info", (req, res) => {
  let param = req.params
  res.json(ch[param.channel])
})

app.get("/:channel/watch", (req, res) => {
  let param = req.params
  let channel = ch[param.channel]
  if (channel.freeStream) {
    res.redirect(channel.freeStream)
  } else if (channel.regex) {
    if (channel.get) {
      let options = {
        url: channel.get,
        headers : {
          "Referer" : channel.url
        }
      }
      request(options, (error, response, html) => {
        if (!error && response.statusCode == 200) {
          let pattern = new RegExp(channel.regex)
          data = html.match(pattern)[0].replace(/\\/g, "").replace(/'/g,"").replace(/"/g, "")
          if (channel.proxy) {
            res.redirect(channel.proxy+data)
          } else {
            res.redirect(data)
          }
        }
      })
    } else {
      request(channel.url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
          let pattern = new RegExp(channel.regex)
          data = html.match(pattern)[0].replace(/\\/g, "")
          res.redirect(data)
        } else {
          res.json({msg:"something wrong"})
        }
      })
    }
  }
})

app.get("/list/m3u8", (req, res) => {
  let header = "#EXTM3U\n"
  let hostname = req.hostname
  let playlist = "#EXTINF:0 tvg-logo=\"http://"+hostname+"/images/{image}.png\", {name}\nhttp://"+hostname+"/{self}/watch\n"
  let data = ""
  data += header
  Object.keys(ch).forEach((key) => {
    let channel = ch[key]
    data += playlist.replace("{image}", channel.self).replace(/{name}/g, channel.name).replace("{self}" , channel.self)
  })
  res.setHeader('Content-Type', 'audio/x-mpegurl; charset=utf-8')
  res.end(data)
})

app.get("/list/json", (req, res) => {
  let hostname = req.hostname
  let data = []
  Object.keys(ch).forEach((key) => {
    let channel = ch[key]
    data.push({name: ch[key].name, stream: `http://${hostname}/${ch[key].self}/watch`, logo: `http://${hostname}/images/${ch[key].self}.png`})
  })
  res.json(data)
})

/*priv*/

//dogus
app.get("/dogus/:ch", (req, res) => {
  let param = req.params
  let channel = ch.eurostar
  request(channel.url, (error, response, html) => {
    let pattern = new RegExp(channel.regex)
    data = html.match(pattern)[0].replace(/\\/g, "").replace("staravrupa", param.ch)
    res.json({link: data})
  })
})

//euronews
app.get("/euronews/lang/:lang", (req, res) => {
  let param = req.params
  let channel = ch.euronews
  request(channel.url, (error, response, html) => {
    request(JSON.parse(html).url, (error2, response2, html2) => {
      data = JSON.parse(html2).primary[param.lang].hls
      res.json({link: data})
    })
  })
})

let port = 80
app.listen(port, ()=>{
  console.log(port+' listening...')
})