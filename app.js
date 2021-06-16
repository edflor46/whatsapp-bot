const fs = require('fs');
const ora = require('ora');
const moment = require('moment'); 
const chalk = require('chalk');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


const SESSION_FILE_PATH = './session.json';
let client;
let sessionData;

/*=========EXPRESS==========*/
const sendApi = (req, res) => {
    const {message, to} = req.body;
    const newNumber = `${to}@c.us`
    console.log(message, to);
    res.send({status:'Enviado'})
    sendMessage(newNumber, message)
}
app.post('/send', sendApi)


/*==========SI HAY UNA SESSION==========*/
const withSession = () => {

    //Loading
    const spinner = ora(`Cargando ${chalk.yellow('Validando session con whatsapp...')}`);
    sessionData = require(SESSION_FILE_PATH);
    spinner.start();

    //Instancia del cliente
    client = new Client({
        session: sessionData
    });

    //Cliente listo
    client.on('ready', () => {
        console.log('Cliente listo');
        spinner.stop();
        listenMessage();
    });

    //SI hay algun error de autenticacion
    client.on('auth_failure', () => {
        /**
         * ¡RECOMENDACION! Es necesario borrar el archivo o removerla de la base de datos 
         * si se tiene en uso 
         */
        spinner.stop();
        console.log('Error de autenticacion, genere un nuevo codigo QR');
    });

    // Iniciar servicio 
    client.initialize();



}

/*==========Escucha cuando un mensaje es recibido==========*/
const listenMessage = () => {
    client.on('message', (msg) => {
        const { from, to, body } = msg;

        console.log(from, to, body);

        sendMessage(from, 'Hola soy un bot, Eduardo por el momento esta ocupado y no puede responder...');
        console.log(`${chalk.yellow(body)}`);
        // switch (body) {
        //     case 'sasuke':
        //         sendMessage(from, 'Te envio lo que solicitaste')
        //         sendMedia(from, 'sasuke.jpg')
        //         break;
        
        //     default:
        //         break;
        // }
        saveHistorial(from, body);
        /**Respuestas frecuentes */
        // switch (body) {
        //     case 'Hola':
        //         sendMessage(from, 'Hola soy un bot, Eduardo por el momento esta ocupado y no puede responder...');
                
        //         break;
        
        //     default:
        //         break;
        // }
    });
}

/*==========ENVIAR MSG===========*/
const sendMessage = (to, message) => {
    client.sendMessage(to, message)

}