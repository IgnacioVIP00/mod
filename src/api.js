const { QuickDB } = require("quick.db");
const db = new QuickDB();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require('express');
const app = express();  
const noblox = require("noblox.js");

app.get('/', (req, res) => {
  res.json("hi")
});

app.get('/jjj', async (req, res) => {
  db.delete(`status_${req.query.id}`)
  res.send(`Successfully removed ${await noblox.getUsernameFromId(req.query.id)}'s status`)
});

async function getStatus(id) {
  function getDate(seconds) {
    let t = new Date(1970, 0, 1);
    return t.setSeconds(seconds);
  };
  
  let abcd;

  let jjjjj = require("./groups")
  let aosGroups = jjjjj.AoS
  let kosGroups = jjjjj.KoS

  for (groupK in kosGroups) {
    let group = kosGroups[groupK];

    let rank = await noblox.getRankInGroup(group.id, id);
    if (rank > 0) {
      abcd = { status: "KOS", reason:  `Group membership - ${group.name} (${group.id})`}
    }
  };

  for (groupK in aosGroups) {
    let group = aosGroups[groupK];

    let rank = await noblox.getRankInGroup(group.id, id);
    if (rank > 0) {
    abcd = { status: "AOS", reason:  `Group membership - ${group.name} (${group.id})`}
    }
  };

  async function getStatuss(id) {
    let status = await db.get(`status_${id}`);
    
    if (status || abcd) {        
      if (status) {
        if (getDate(status.time) > new Date()) {
        return { status: `${status.status}`, reason:  `${status.reason}`}
        } else {
          await db.delete(`status_${id}`);
          return { status: `none` }
        }
      } else return abcd
    } else return { status: `none` };
  };
  return await getStatuss(id)
};


app.get('/s', async (req, res) => {
  res.json(await getStatus(req.query.id))
});

app.get('/status', async (req, res) => {
  let statusInfo = {
    time: req.query.time,
    date: req.query.date.substring(0, req.query.date.lastIndexOf(' ')),
    reason: req.query.reason,
    mod: req.query.mod,
    status: req.query.status
  }
  db.set(`status_${req.query.id}`, statusInfo)
  
  let jaj = await noblox.getUsernameFromId(req.query.id)
  res.send(`Successfully made ${jaj} ${req.query.status} for "${req.query.reason}" until ${req.query.date}`)
});

app.get('/groups', async (req, res) => {
  res.json(require("./groups"))
});

app.get('/a', async (req, res) => {
  db.delete(`ban_${req.query.id}`)
  res.send(`Successfully unbanned ${await noblox.getUsernameFromId(req.query.id)}`)
});

app.get('/b', async (req, res) => {
  let banInfo = {
    time: req.query.time,
    date: req.query.date.substring(0, req.query.date.lastIndexOf(' ')),
    reason: req.query.reason,
    mod: req.query.mod
  }
  db.set(`ban_${req.query.id}`, banInfo)
  let jaj = await noblox.getUsernameFromId(req.query.id)
  res.send(`Successfully banned ${jaj} for "${req.query.reason}" until ${req.query.date}`)
});

app.get('/leaderboard', (req, res) => {
  let token = req.query.token;
  let userId = req.query.userid;
  let username = req.query.username;
  let donated = req.query.donated;
  let rank = req.query.rank;

  if (token !== process.env.tokenn) return res.json("unauthorized");

  let q = {
    userId: userId,
    username: username,
    donated: donated
  };

  db.set(`${rank}`, q);
  res.json("ok");
});

listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

module.exports = listener;