/**
 * ⚡⚡⚡ DECLARAMOS LAS LIBRERIAS y CONSTANTES A USAR! ⚡⚡⚡
 */
const fs = require('fs');
const mimeDb = require('mime-db')
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// const moment = require('moment');
const ora = require('ora');
const chalk = require('chalk');
// const ExcelJS = require('exceljs');
const qrcode = require('qrcode-terminal');
// const { flowConversation } = require('./conversation')
const { Client, MessageMedia } = require('whatsapp-web.js');
const app = express();
app.use(express.urlencoded({ extended: true }))
const SESSION_FILE_PATH = './session.json';
let client;
let sessionData;
// let stkmode = false;


// /**
//  * Guardamos archivos multimedia que nuestro cliente nos envie!
//  * @param {*} media 
//  */
const saveMedia = (media) => {

    const extensionProcess = mimeDb[media.mimetype]
    const ext = extensionProcess.extensions[0]
    const filename = uuidv4();
    console.log(ext)
    if (ext === 'jpeg') {
        fs.writeFile(`./media/images/${filename}.${ext}`, media.data, { encoding: 'base64' }, function (err) {
            console.log('** Archivo Media Guardado **');
        });
    }
    else if (ext === 'mp4') {
        fs.writeFile(`./media/videos/${filename}.${ext}`, media.data, { encoding: 'base64' }, function (err) {
            console.log('** Archivo Media Guardado **');
        });
    }
    else if (ext === 'webp') {
        fs.writeFile(`./media/stickers/${filename}.${ext}`, media.data, { encoding: 'base64' }, function (err) {
            console.log('** Archivo Media Guardado **');
        });
    }
}

// /**
//  * Enviamos archivos multimedia a nuestro cliente
//  * @param {*} number 
//  * @param {*} fileName 
//  */
const sendMedia = (number, fileName) => {
    number = number.replace('@c.us', '');
    number = `${number}@c.us`
    const media = MessageMedia.fromFilePath(`./mediaSend/${fileName}`);
    client.sendMessage(number, media);
}

// /**
//  * Enviamos un mensaje simple (texto) a nuestro cliente
//  * @param {*} number 
//  */
const sendMessage = (number = null, text = null) => {
    number = number.replace('@c.us', '');
    number = `${number}@c.us`
    const message = text || `Hola soy un BOT recuerda https://www.youtube.com/leifermendez`;
    client.sendMessage(number, message);
    readChat(number, message)
    console.log(`${chalk.red('⚡⚡⚡ Enviando mensajes....')}`);
}

// /**
//  * Escuchamos cuando entre un mensaje
//  */


const listenMessage = () => {
    client.on('message', async msg => {
        
        const { from, to, body, type } = msg;
        const {name, isGroup} = await msg.getChat()
        // if(msg.body === '#'){
        //     stkmode = true;
        //     client.sendMessage(from, 'Enabled Stiker mode')
        // }
        // else if(msg.body === '/'){
        //     stkmode = false;
        //     client.sendMessage(from, 'Disabled Sticker mode')
        //     }
        // console.log(msg)
        // console.log(isGroup)
        // console.log(name)
        // console.log(type)
        if (msg.hasMedia && isGroup && name==='Stk') {
            // if(stkmode){
            const media = await msg.downloadMedia();
            saveMedia(media);
            // client.sendMessage('5216142553874@c.us', media)
            msg.reply(media, from, { sendMediaAsSticker: true })
            console.log('**Sticker enviado**')
            // client.sendMessage(from, media, {sendMediaAsSticker: true })
        }
        // }
        // if(from ==='5216141525368@c.us'){
        // msg.star()
        // }
        // }

        // await greetCustomer(from);

        // console.log(body);

        // await replyAsk(from, body);

        // await readChat(from, body)
        // console.log(`${chalk.red('⚡⚡⚡ Enviando mensajes....')}`);
        // console.log('Guardar este número en tu Base de Datos:', from);

    });
}

/**
 * Response a pregunta
 */

const replyAsk = (from, answer) => new Promise((resolve, reject) => {
    console.log(`---------->`, answer);
    if (answer === 'Quieromeme') {
        sendMedia(from, 'meme-1.png')
        resolve(true)
    }

})

/**
 * Revisamos si tenemos credenciales guardadas para inciar sessio
 * este paso evita volver a escanear el QRCODE
 */
const withSession = () => {
    // Si exsite cargamos el archivo con las credenciales
    const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp...')}`);
    sessionData = require(SESSION_FILE_PATH);
    spinner.start();
    client = new Client({
        ffmpegPath: 'C:/Program Files (x86)/ffmpeg/bin/ffmpeg.exe',
        puppeteer: {
            executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        },
        session: sessionData
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        spinner.stop();

        // sendMessage();
        // sendMedia();

        connectionReady();

    });



    client.on('auth_failure', () => {
        spinner.stop();
        console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');
    })


    client.initialize();
}

/**
 * Generamos un QRCODE para iniciar sesion
 */
const withOutSession = () => {
    console.log('No tenemos session guardada');
    client = new Client({
        puppeteer: {
            executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        }
    });
    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        connectionReady();
    });

    client.on('auth_failure', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE **');
    })


    client.on('authenticated', (session) => {
        // Guardamos credenciales de de session para usar luego
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.log(err);
            }
        });
    });

    client.initialize();
}

const connectionReady = () => {
    listenMessage();
    // readExcel();
}

(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();
