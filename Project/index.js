const express = require('express');
const app = express();
const APIKEY = 'b7a436a44cfe452b9ac413d659b50e01';
const apiai = require('apiai')(APIKEY);
//const port = 3000;

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(3000);
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

//app.listen(server, () => console.log('Example app listening on port 3000!'))


// recognition.addEventListener('result', (e) => {
//   let last = e.results.length - 1;
//   let text = e.results[last][0].transcript;
//   socket.emit('chat message', text);
//   console.log('Confidence: ' + e.results[0][0].confidence);
// })

// io.on('connection', function(socket) {
//   socket.on('chat message', (text) => {
//
//     // Get a reply from API.AI
//
//     let apiaiReq = apiai.textRequest(text, {
//       sessionId: APIAI_SESSION_ID
//     });
//
//     apiaiReq.on('response', (response) => {
//       let aiText = response.result.fulfillment.speech;
//       socket.emit('bot reply', aiText); // Send the result back to the browser!
//     });
//
//     apiaiReq.on('error', (error) => {
//       console.log(error);
//     });
//
//     apiaiReq.end();
//
//   });
// });

// server.listen(3000);
