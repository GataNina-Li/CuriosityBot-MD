//Código elaborado por Zam (Azamijs)

require('./settings.js')
const { default: makeWASocket,  generateWAMessage,  downloadContentFromMessage,  emitGroupParticipantsUpdate,  emitGroupUpdate,  makeInMemoryStore,  prepareWAMessageMedia, MediaType,  WAMessageStatus, AuthenticationState, GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions,  useMultiFileAuthState, BufferJSON,  WAMessageProto,  MessageOptions,	 WAFlag,  WANode,	 WAMetric,	 ChatModification,  MessageTypeProto,  WALocationMessage, ReconnectMode,  WAContextInfo,  proto,	 WAGroupMetadata,  ProxyAgent,	 waChatKey,  MimetypeMap,  MediaPathMap,  WAContactMessage,  WAContactsArrayMessage,  WAGroupInviteMessage,  WATextMessage,  WAMessageContent,  WAMessage,  BaileysError,  WA_MESSAGE_STATUS_TYPE,  MediaConnInfo,   generateWAMessageContent, URL_REGEX,  Contact, WAUrlInfo,  WA_DEFAULT_EPHEMERAL,  WAMediaUpload,  mentionedJid,  processTime,	 Browser,  MessageType,  Presence,  WA_MESSAGE_STUB_TYPES,  Mimetype,  relayWAMessage,	 Browsers,  GroupSettingChange,  delay,  DisconnectReason,  WASocket,  getStream,  WAProto,  isBaileys,  AnyMessageContent,  generateWAMessageFromContent, fetchLatestBaileysVersion,  processMessage,  processingMutex,  jidDecode,  areJidsSameUser } = require('@whiskeysockets/baileys')
let pino = require('pino')
const path = require('path');
const fs = require('fs')
const axios = require('axios')
const { exec, spawn, execSync } = require('child_process')
const speed = require('performance-now')
const chalk = require('chalk')
const cfonts = require('cfonts')
const os = require('os')
const yargs = require('yargs/yargs')
const _ = require('lodash')
const moment = require('moment')
const gradient = require('gradient-string')
const readline = require('readline')
const { tmpdir } = require('os')
const { join } = require('path')
const PhoneNumber = require('awesome-phonenumber')
const { smsg, sleep } = require('./lib/func')
const { readdirSync, statSync, unlinkSync } = require('fs')
const { say } = cfonts
const color = (text, color) => {
return !color ? chalk.green(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text)
}

const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout })
return new Promise((resolve) => {
rl.question(text, resolve)
})}
const usePairingCode = true
const girastamp = speed()
const latensi = speed() - girastamp
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

async function connectToWhatsApp() {
const { state, saveCreds } = await useMultiFileAuthState(global.session)
const { version, isLatest } = await fetchLatestBaileysVersion()

const colores = chalk.bold.white
const opcionQR = chalk.blueBright
const opcionTexto = chalk.cyan
const marco = chalk.yellow
const nameb = chalk.blue.bgBlue.bold.cyan
const methodCodeQR = process.argv.includes('qr')
const MethodMobile = process.argv.includes('mobile')

say('Curiosity|Bot', {
align: 'center',
colors: false,
background: 'transparent',
letterSpacing: 1,
lineHeight: 1,
space: true,
maxLength: '0',
gradient: ['blue', 'red'],
independentGradient: false,
transitionGradient: false,
rawMode: true,
env: 'node'
})
  
let opcion
if (!fs.existsSync(`./${session}/creds.json`) && !methodCodeQR) {
while (true) {
opcion = await question(marco('*************************\n') + nameb('CuriosityBot-MD\n') + marco('*************************\n') + colores('Seleccione una opción:\n') + opcionQR('1. Con código QR\n') + opcionTexto('2. Con código de emparejamiento\n'))
if (opcion === '1' || opcion === '2') {
break
} else {
console.log(chalk.redBright('Por favor, seleccione solo 1 o 2.'))
}}
opcion = opcion
}
console.info = () => {}
const client = makeWASocket({
version,
logger: pino({ level: 'silent'}),
printQRInTerminal: opcion == '1' ? true : false,
qrTimeout: 180000,
browser: ['Ubuntu', 'Edge', '20.0.04'],
auth: state
})
if (opcion === '2') {
if (usePairingCode && !client.authState.creds.registered) {
const phoneNumber = await question(chalk.blueBright('Ingrese su número de WhatsApp todo junto\n') + chalk.greenBright('Ejemplo: 521729999\n'))
console.log(phoneNumber)
const code = await client.requestPairingCode(phoneNumber.replace(/\D/g, '').trim())
console.log(chalk.bold.cyanBright(`Codigo de emparejamiento:`), chalk.bold.white(`${code}`))
}}

client.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}
client.ev.on('chats.set', () => {
console.log('Estableciendo conversaciones...')
})
client.ev.on('contacts.set', () => {
console.log('Estableciendo contactos...')
})
client.ev.on('creds.update', saveCreds)
client.ev.on('messages.upsert', async ({ messages }) => {
try {
m = messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.key && m.key.remoteJid === 'status@broadcast') return
if (!client.public && !m.key.fromMe && messages.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
m = smsg(client, m)
require('./main')(client, m, messages)
} catch (err) {
console.log(err)
}
})
  
//batabase  
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

(async () => {
const { Low, JSONFile } = await import('lowdb');

const databasePath = path.join(__dirname, 'database');
if (!fs.existsSync(databasePath)) fs.mkdirSync(databasePath);

const usersPath = path.join(databasePath, 'users');
const chatsPath = path.join(databasePath, 'chats');
const settingsPath = path.join(databasePath, 'settings');
const msgsPath = path.join(databasePath, 'msgs');
const stickerPath = path.join(databasePath, 'sticker');
const statsPath = path.join(databasePath, 'stats');

[usersPath, chatsPath, settingsPath, msgsPath, stickerPath, statsPath].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  });

  function getFilePath(basePath, id) {
    return path.join(basePath, `${id}.json`);
  }

  global.db = {
    data: {
      users: {},
      chats: {},
      settings: {},
      msgs: {},
      sticker: {},
      stats: {},
    },
    chain: null,
  };

  global.loadDatabase = async function loadDatabase() {
const userFiles = fs.readdirSync(usersPath);
    for (const file of userFiles) {
      const userId = path.basename(file, '.json');
      const userDb = new Low(new JSONFile(getFilePath(usersPath, userId)));
      await userDb.read();
      userDb.data = userDb.data || {};
      global.db.data.users[userId] = userDb.data;
    }
    
    const chatFiles = fs.readdirSync(chatsPath);
    for (const file of chatFiles) {
      const chatId = path.basename(file, '.json');
      const chatDb = new Low(new JSONFile(getFilePath(chatsPath, chatId)));
      await chatDb.read();
      chatDb.data = chatDb.data || {};
      global.db.data.chats[chatId] = chatDb.data;
    }

    const settingsFiles = fs.readdirSync(settingsPath);
    for (const file of settingsFiles) {
      const settingId = path.basename(file, '.json');
      const settingDb = new Low(new JSONFile(getFilePath(settingsPath, settingId)));
      await settingDb.read();
      settingDb.data = settingDb.data || {};
      global.db.data.settings[settingId] = settingDb.data;
    }

    const msgsFiles = fs.readdirSync(msgsPath);
    for (const file of msgsFiles) {
      const msgId = path.basename(file, '.json');
      const msgDb = new Low(new JSONFile(getFilePath(msgsPath, msgId)));
      await msgDb.read();
      msgDb.data = msgDb.data || {};
      global.db.data.msgs[msgId] = msgDb.data;
    }

    const stickerFiles = fs.readdirSync(stickerPath);
    for (const file of stickerFiles) {
      const stickerId = path.basename(file, '.json');
      const stickerDb = new Low(new JSONFile(getFilePath(stickerPath, stickerId)));
      await stickerDb.read();
      stickerDb.data = stickerDb.data || {};
      global.db.data.sticker[stickerId] = stickerDb.data;
    }

    const statsFiles = fs.readdirSync(statsPath);
    for (const file of statsFiles) {
      const statId = path.basename(file, '.json');
      const statDb = new Low(new JSONFile(getFilePath(statsPath, statId)));
      await statDb.read();
      statDb.data = statDb.data || {};
      global.db.data.stats[statId] = statDb.data;
    }
  };

  global.db.save = async function saveDatabase() {
    // Guardar usuarios
    for (const [userId, userData] of Object.entries(global.db.data.users)) {
      const userDb = new Low(new JSONFile(getFilePath(usersPath, userId)));
      userDb.data = userData;
      await userDb.write();
    }

    // Guardar chats
    for (const [chatId, chatData] of Object.entries(global.db.data.chats)) {
      const chatDb = new Low(new JSONFile(getFilePath(chatsPath, chatId)));
      chatDb.data = chatData;
      await chatDb.write();
    }

    // Guardar settings
    for (const [settingId, settingData] of Object.entries(global.db.data.settings)) {
      const settingDb = new Low(new JSONFile(getFilePath(settingsPath, settingId)));
      settingDb.data = settingData;
      await settingDb.write();
    }

    // Guardar msgs
    for (const [msgId, msgData] of Object.entries(global.db.data.msgs)) {
      const msgDb = new Low(new JSONFile(getFilePath(msgsPath, msgId)));
      msgDb.data = msgData;
      await msgDb.write();
    }

    // Guardar sticker
    for (const [stickerId, stickerData] of Object.entries(global.db.data.sticker)) {
      const stickerDb = new Low(new JSONFile(getFilePath(stickerPath, stickerId)));
      stickerDb.data = stickerData;
      await stickerDb.write();
    }

    // Guardar stats
    for (const [statId, statData] of Object.entries(global.db.data.stats)) {
      const statDb = new Low(new JSONFile(getFilePath(statsPath, statId)));
      statDb.data = statData;
      await statDb.write();
    }
  };

await loadDatabase();

setInterval(async () => {
    await global.db.save();
    console.log("Datos guardados en la base de datos exitosamente.");
  }, 30000);
})();

  
/*var low
try {
low = require('lowdb')
} catch (e) {
low = require('./lib/lowdb')}
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile('database.json')
)
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
...(global.db.data || {})}
global.db.chain = _.chain(global.db.data)}
loadDatabase()
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
}, 1 * 1000)*/

function clearTmp() {
const tmp = [tmpdir(), join(__dirname, './tmp')]
const filename = []
tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))))
return filename.map((file) => {
const stats = statSync(file)
if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) {
return unlinkSync(file)
}
return false
})}

if (!opts['test']) { 
//f (global.db) { 
setInterval(async () => { 
//if (global.db.data) await global.db.save()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
}, 30 * 1000)
}
setInterval(async () => {
await clearTmp()
console.log(chalk.blueBright(`\nBasura eliminada\n`))}, 180000)

const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=:\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
  
client.ev.on('groups.update', async (json) => {
const res = json[0]
if (res.announce == true) {
await sleep(2000)
try {
ppgroup = await client.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}

let text = `🍟 *¡Ahora solo los administradores pueden enviar mensajes!*`
client.sendContextInfoIndex(res.id, text, fkontak)
} else if (res.announce == false) {
await sleep(2000)
try {
ppgroup = await client.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `🍟 *Ahora todos los participantes pueden mandar mensajes*`
client.sendContextInfoIndex(res.id, text, fkontak)
} else if (res.restrict == true) {
await sleep(2000)
try {
ppgroup = await client.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `🍟 *Ahora solo los administradores pueden editar la información del grupo*`
client.sendContextInfoIndex(res.id, text, fkontak)
} else if (res.restrict == false) {
await sleep(2000)
try {
ppgroup = await client.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `🍟 *Ahora todos los usuarios pueden editar la información del grupo*`
client.sendContextInfoIndex(res.id, text, fkontak)
} else if(!res.desc == ''){
await sleep(2000)
try {
ppgroup = await client.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `🍟 *¡Se ha modificado la descripción!*\n\n- Nueva descripción:\n${res.desc}`
client.sendContextInfoIndex(res.id, text, fkontak)
} else {
await sleep(2000)
try {
ppgroup = await client.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `🍟 *¡Se ha modificado el título del grupo!*\n\n- Nuevo nombre:\n${res.subject}`
client.sendContextInfoIndex(res.id, text, fkontak)
}})

client.ev.on('group-participants.update', async (anu) => {
if (global.db && global.db && global.db.data && global.db.data.chats && global.db.data.chats[m.chat].welcome) {
try {
let metadata = await client.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await client.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://qu.ax/OEgX.jpg'
}
try {
ppgroup = await client.profilePictureUrl(anu.id, 'image')
} catch {
ppgroup = 'https://qu.ax/OEgX.jpg'
}
if (anu.action == 'add') {
client.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `Hola *@${num.split('@')[0]}* Bienvenido a *${metadata.subject}*`})
} else if (anu.action == 'remove') {
} else if (anu.action == 'promote') {
let usuario = anu.author
client.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num, usuario], caption: `🚩 *@${num.split('@')[0]}* Ha sido ascendido al rol de *administrador* en este grupo.\n\n> Acción hecha por @${usuario.split("@")[0]}`})
} else if (anu.action == 'demote') {
let usuario = anu.author
client.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num, usuario], caption: `🚩 *@${num.split('@')[0]}* Ha sido removido de su rol de *administrador* en este grupo.\n\n> Acción hecha por @${usuario.split("@")[0]}`})
}
}
} catch (err) {
console.log(err)
}
}
})

client.sendText = (jid, text, quoted = '', options) => client.sendMessage(jid, { text: text, ...options }, { quoted })
client.sendContactArray = (jid, data, quoted, options) => client.sendMessage(jid, { contacts: { displayName: (Array.isArray(data[0]) ? data[0][1] : data.length > 1 ? '2013 kontak' : data[0].displayName) || null, contacts: (Array.isArray(data[0]) ? data : [data]).map(([number, name, isi, isi1, isi2, isi3, isi4, isi5]) => ({ vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:${name.replace(/\n/g, '\\n')}\nitem.ORG:${isi}\nitem1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}\nitem1.X-ABLabel:${isi1}\nitem2.EMAIL;type=INTERNET:${isi2}\nitem2.X-ABLabel:📧 Email\nitem3.ADR:;;${isi3};;;;\nitem3.X-ABADR:ac\nitem3.X-ABLabel:📍 Region\nitem4.URL:${isi4}\nitem4.X-ABLabel:Website\nitem5.X-ABLabel:${isi5}\nEND:VCARD`.trim(), displayName: name })) }}, { quoted, ...options })

client.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect, receivedPendingNotifications, isNewLogin} = update
console.log(receivedPendingNotifications)

if (connection == 'connecting') {
console.log('🚀 Iniciando...')
}
if (lastDisconnect === undefined) {
}

if(connection === 'close') {
var shouldReconnect = (lastDisconnect.error.Boom)?.output?.statusCode !== DisconnectReason.loggedOut  
console.log(`Reconectando...`)
connectToWhatsApp()
}

if (update.isNewLogin) {
console.log(chalk.yellow(`Primer inicio de sesión exitoso`))
}

if (connection == 'open') {
console.log(color('Fecha', '#009FFF'),
color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'),
color(`\n☁️ Conectado correctamente al WhatsApp.\n`, '#7fff00')
)
console.log(receivedPendingNotifications)
await joinChannels(client)
}
})

client.public = true
store.bind(client.ev)
client.ev.on('creds.update', saveCreds)
process.on('uncaughtException', console.log)
process.on('unhandledRejection', console.log)
process.on('RefenceError', console.log)
}

connectToWhatsApp()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})

async function joinChannels(client) {
for (const channelId of Object.values(global.ch)) {
await client.newsletterFollow(channelId).catch(() => {})
}}