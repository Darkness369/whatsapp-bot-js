/**
 * Difundir mensaje a clientes
 */
// const readExcel = async () => {
//     const pathExcel = `./chats/clientes-saludar.xlsx`;
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(pathExcel);
//     const worksheet = workbook.getWorksheet(1);
//     const columnNumbers = worksheet.getColumn('A');
//     columnNumbers.eachCell((cell, rowNumber) => {
//         const numberCustomer = cell.value

//         const columnDate = worksheet.getRow(rowNumber);
//         let prevDate = columnDate.getCell(2).value;
//         prevDate = moment.unix(prevDate);
//         const diffMinutes = moment().diff(prevDate, 'minutes');

//         // Si ha pasado mas de 60 minuitos podemos enviar nuevamente
//         if (diffMinutes > 60) {
//             sendMessage(numberCustomer)
//             columnDate.getCell(2).value = moment().format('X')
//             columnDate.commit();

//         }
//     });

//     workbook.xlsx.writeFile(pathExcel);

// }


// /**
//  * Guardar historial de conversacion
// //  * @param {*} number 
// //  * @param {*} message 
// //  */
// const readChat = async (number, message) => {
//     const pathExcel = `./chats/${number}.xlsx`;
//     const workbook = new ExcelJS.Workbook();
//     const today = moment().format('DD-MM-YYYY hh:mm')

//     if (fs.existsSync(pathExcel)) {
//         /**
//          * Si existe el archivo de conversacion lo actualizamos
//          */
//         const workbook = new ExcelJS.Workbook();
//         workbook.xlsx.readFile(pathExcel)
//             .then(() => {
//                 const worksheet = workbook.getWorksheet(1);
//                 const lastRow = worksheet.lastRow;
//                 var getRowInsert = worksheet.getRow(++(lastRow.number));
//                 getRowInsert.getCell('A').value = today;
//                 getRowInsert.getCell('B').value = message;
//                 getRowInsert.commit();
//                 workbook.xlsx.writeFile(pathExcel);
//             });

//     } else {
//         /**
//          * NO existe el archivo de conversacion lo creamos
//          */
//         const worksheet = workbook.addWorksheet('Chats');
//         worksheet.columns = [
//             { header: 'Fecha', key: 'number_customer' },
//             { header: 'Mensajes', key: 'message' }
//         ];
//         worksheet.addRow([today, message]);
//         workbook.xlsx.writeFile(pathExcel)
//             .then(() => {

//                 console.log("saved");
//             })
//             .catch((err) => {
//                 console.log("err", err);
//             });
//     }
// }

// /**
//  * Saludos a primera respuesta
//  * @param {*} req 
//  * @param {*} res 
//  */

// const greetCustomer = (from) => new Promise((resolve, reject) => {
//     from = from.replace('@c.us', '');

//     const pathExcel = `./chats/${from}@c.us.xlsx`;
//     if (!fs.existsSync(pathExcel)) {
//         const firstMessage = [
//             '👋 Ey! que pasa bro',
//             'Recuerda subscribirte a mi canal de YT',
//             'https://www.youtube.com/leifermendez',
//             'de regalo te  dejo algunos de mis cursos',
//             '🔴 Aprende ANGULAR desde cero 2021 ⮕ https://bit.ly/367tJ32',
//             '✅ Aprende NODE desde cero 2021 ⮕ https://bit.ly/3od1Bl6',
//             '🔵 (Socket.io) NODE (Tutorial) ⮕ https://bit.ly/3pg1Q02',
//             '------',
//             '------',
//             'Veo que es la primera vez que nos escribes ¿Quieres que te envie un MEME?',
//             'Responde Quieromeme'
//         ].join(' ')

//         sendMessage(from, firstMessage)
//         sendMedia(from, 'curso-1-1.png')
//         sendMedia(from, 'curso-2.png')
//         sendMedia(from, 'curso-3.png')
//     }
//     resolve(true)
// })

/**
 * Controladores
 */

// const sendMessagePost = (req, res) => {
//     const { message, number } = req.body
//     console.log(message, number);
//     sendMessage(number, message)
//     res.send({ status: 'Enviado!' })
// }

/**
 * Rutas
 */

// app.post('/send', sendMessagePost);

/**
 * Revisamos si existe archivo con credenciales!
 */


// app.listen(9000, () => {
//     console.log('Server ready!');
// })