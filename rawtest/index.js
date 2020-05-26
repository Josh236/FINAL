const video = document.getElementById("#video");

// Promise.all([
//   faceapi.nets.tinyFaceDetector.loadFromUri('/sources'),
//   faceapi.nets.faceLandmark68Net.loadFromUri('/sources'),
//   faceapi.nets.faceRecognitionNet.loadFromUri('/sources'),
//   faceapi.nets.faceExpressionNet.loadFromUri('/sources')
// ]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    {video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  )
}

startVideo();

const recordbtn = document.querySelector('#record');
const stopbtn = document.querySelector('#stop-record');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interminResults = false;

recognition.onresult = function(event) {
  const recog = event.results[0][0].transcript;
  console.log(recog);
  document.getElementById('input').value = recog;
}

recordbtn.addEventListener('click', function(e) {
  recognition.start();
  console.log('Listening');
})

stopbtn.addEventListener('click', () => {
  recognition.stop();
  console.log('Listening stopped');
})


//trigger or recog
const trigger = [
  //0
  ["hi", "hey", "hello"],
  //1
  ["how are you", "how are things"],
  //2
  ["what is going on", "what is up"],
  //3
  ["happy", "good", "well", "fantastic", "cool"],
  //4
  ["bad", "bored", "tired", "sad"],
  //5
  ["tell me story", "tell me joke"],
  //6
  ["thanks", "thank you"],
  //7
  ["what is your name", "what are you called"],
  //8
  ["bye", "good bye", "goodbye"]


];

const reply =[
  //0
  ["Hello", "Hi", "Hey", "Hi there", "Greetings"],
  //1
  [ "Fine, how are you?",
    "Pretty well, how are you?",
    "Good, what about yourself?"
  ],
  //2
  ["I'm here talking", "Just watching you", "I'm talking with many people"],
  //3
  ["Good to hear", "How so?"],
  //4
  ["That is unfortunate", "How so?"],
  //5
  ["What about?", "Once upon a time.."],
  //6
  ["You're welcome", "No Problem"],
  //7
  ["My name is Watcher", "Yours first"],
  //8
  ["Goodbye", "I'll see you later"]


];

const alternative = [
  "Same",
  "Go on...",
  "Try again",
  "I'm listening...",
];

document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("input")
  inputField.addEventListener("keydown", function(e) {
    if (e.code === "Enter") {
      let input = inputField.value;
      inputField.value = "";
      output(input);
    }
  });
});

function output(input) { //recog here
  let product;
  let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");

  text = text
    .replace(/ a /g, " ")
    .replace(/i feel /g,  "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "");

    if (compare(trigger, reply, text)){
      product = compare(trigger, reply, text);
    } else if (text.match(/robot/gi)){
      product = robot[Math.floor(Math.random() * robot.length)];
    } else {
      product = alternative[Math.floor(Math.random() * alternative.length)];
    }
    addChat(input, product);
  }

function addChat(input, product) {
  const mainDiv = document.getElementById("main");
  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.innerHTML = `You: <span id="user-response">${input}</span>`;
  mainDiv.appendChild(userDiv);

  let botDiv = document.createElement("div");
  botDiv.id = "bot";
  botDiv.innerHTML = `Chatbot: <span id="bot-response">${product}</span>`;
  mainDiv.appendChild(botDiv);
}

function compare(triggerArray, replyArray, text){
  let item;
  for (let x = 0; x < triggerArray.length; x++){
    for (let y = 0; y < triggerArray.length; y++){
      if (triggerArray[x][y] == text){
        items  = replyArray[x];
        item = items[Math.floor(Math.random() * items.length)];
      }
    }
  }
  return item;
}
