const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const socket = io();

recognition.lang = 'en-US';
recognition.interminResults = false;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', (e) => {
  let last = e.queryResult.length - 1;
  let chat = e.queryResult[last][0].transcript;
  socket.emit('chat message', chat);
  console.log('Confidence: ' + e.queryResult[0][0].confidence);
});

io.on('connection', function(socket) {
  socket.on('chat message', (chat) => {

    // Get a reply from API.AI

    let apiaiReq = apiai.textRequest(chat, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.queryResult.fulfillment.text;
      socket.emit('bot reply', aiText); // Send the result back to the browser!
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});

function synthVoice(chat) {
  const synth = window.speechSynthesis;
  const utterance = new speechSynthesisUtterance();
  utterance.text = chat;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText){
  synthVoice(replyText);
});
