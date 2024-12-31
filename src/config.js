const settings = {};

settings.token = process.env.TOKEN
settings.botID = process.env.BOTID
settings.serverID = ""

settings.bot = {
  name: 'TEST Bot',
  picture: "https://cdn.discordapp.com/avatars/956220762405105744/190688604179767771022db3fddd80bf.webp?size=80",
  fullName: 'TEST',
  successImage: 'https://media.discordapp.net/attachments/853563195234320394/924268632677167144/success.png',
  failImage: 'https://cdn.discordapp.com/attachments/906597675095429171/928718604004888637/656938700240060422.png',
  mainColor: "#284d73"
}

module.exports = settings;