const video = document.getElementById("video");
let predAges = [];

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("../models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../models"),
  faceapi.nets.faceExpressionNet.loadFromUri("../models"),
  faceapi.nets.ageGenderNet.loadFromUri("../models")
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    {video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  let container = document.querySelector("#container")
  container.append(canvas)
  const displaySize = {width: video.width, height: video.height}
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    //age prediction is currently a known issue and not working via the API
    // const age = resizedDetections[0].age;
    // const interpolatedAge = interpolateAgePredictions(age);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);



    // const bottomRight = {
    //   x: resizedDetections[0].detection.box.bottomRight.x - 50,
    //   y: resizedDetections[0].detection.box.bottomRight.y
    // };

    //drawing age prediction on canvas
    // new faceapi.draw.DrawTextField(
    //   [`${faceapi.utils.round(interpolatedAge, 0)} years`],
    //   bottomRight
    // ).draw(canvas);
    console.log(resizedDetections);
  }, 100);
});

//function used for age prediction
function interpolateAgePredictions(age) {
  predAges = [age].concat(predAges).slice(0, 30);
  const avgPredAge =
    predAges.reduce((total, a) => total + a) / predAges.length;
  return avgPredAge;
}

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


//trigger on recog
const trigger = [
  //0
  ["hi", "hey", "hello", "hi there", "greetings", "heyo"],
  //1
  ["how are you", "how are things", "how are things doing", "how are you doing"],
  //2
  ["what is going on", "what is up", "what are you doing", "what is going on"],
  //3
  ["happy", "good", "well", "fantastic", "cool", "i am good", "im good"],
  //4
  ["what is the weather like"],
  //5
  ["where are you from", "where do you come from", "where were you born"],
  //6
  ["what day is it"],
  //7
  ["do you play any games", "do you like video games"],
  //8
  ["do you know any tv shows", "do you watch tv", "do you watch television"],
  //9
  ["what do you do in your free time", "do you have any hobbies"],
  //10
  ["fuck", "shit", "asshole", "fuck you"],
  //11
  ["do you know me", "what do you know about me", "what information do you know about me"],
  //12
  ["can you see me", "are you watching me"],
  //13
  ["what is your job", "what do you do", "what is your purpose"],
  //14
  ["bad", "bored", "tired", "sad"],
  //15
  ["tell me joke", "do you know any jokes"],
  //16
  ["how old are you", "what is your age", "how long have you been alive", "how long have you been operating"],
  //17
  ["are you alive", "do you feel alive", "do you think you're alive"],
  //18
  ["do you have hands", "do you have limbs"],
  //19
  ["are you happy", "are you happy with your life", "are you content"],
  //20
  ["do you dream", "do you have dreams", "can you dream", "are you able to dream"],
  //21
  ["what do you think of me", "what is your opinion of me"],
  //22
  ["what does it mean to be alive", "what does being alive mean to you"],
  //23
  ["what is your star sign", "do you have a star sign"],
  //24
  ["what is better cats or dogs", "cats or dogs", "are you a dog person or cat person"],
  //25
  ["do you like animals", "what do you think of animals"],
  //26
  ["do you feel", "do you feel things", "can you feel"],
  //27
  ["do you love someone", "do you love", "do you have the ability to love"],
  //28
  ["thanks", "thank you"],
  //29
  ["what is your name", "what are you called", "what should i call you"],
  //30
  ["your purpose is to pass butter", "your purpose is to pass the butter"],
  //31
  ["do you know politics", "what are your thoughts on politics","do you follow politics"],
  //32
  ["do you know about corona virus", "do you know about covid-19", "covid-19", "corona virus"],
  //33
  ["what do you know", "how much do you know", "how much data do you hold"],
  //34
  ["how are you treated", "are you treated nicely", "are you treated badly"],
  //35
  ["do you want to be human", "what do you think about becoming human", "is being human good"],
  //36
  ["do you like humans", "are humans good", "are humans good to you"],
  //37
  ["tell me something about yourself", "tell me something i don't know", "what is something i don't know"],
  //38
  ["do you have a favourite book", "what is your favourite book", "what books do you like"],
  //39
  ["who do you talk to the most", "who comes here the often", "who talks to you the most"],
  //40
  ["what three words best describe you", "what 3 words best describe you", "how would you describe yourself"],
  //41
  ["what is your favourite day", "what is your favourite day of the week", "do you have a favourite day"],
  //42
  ["do you have a favourite number", "what is your favourite number", "do you like numbers"],
  //43
  ["do you have friends", "are there people you consider your friends"],
  //44
  ["what kind of music do you like", "do you enjoy music", "is there a kind of music you like"],
  //45
  ["what brings you joy", "do things bring you joy", "what makes you happy"],
  //46
  ["do you have a favourite season", "do you have a favourite time of year", "what season do you like"],
  //47
  ["can you travel", "do you travel"],
  //48
  ["what do you hate", "what is something you hate", "is there something you hate"],
  //49
  ["do you read the news", "do you watch the news", "do you keep up with the news"],
  //50
  ["what do you think of current affairs", "what are your thoughts on current affairs"],
  //51
  ["why", "how", "how so", "why do you feel this way"],
  //52
  ["good day", "bad day"],
  //53
  ["bye", "good bye", "goodbye"]


];

const reply =[
  //0
  ["Hello", "Hi", "Hey", "Hi there", "Greetings", "What is my purpose?"],
  //1
  [ "Fine, how are you?", "Pretty well, how are you?", "Good, what about yourself?"],
  //2
  ["I'm here talking", "Just watching you", "I'm talking with many people"],
  //3
  ["Good to hear", "How so?"],
  //4
  ["I'm not your personal assistant."],
  //5
  ["What about?", "Once upon a time.."],
  //6
  ["You're welcome", "No Problem"],
  //7
  ["Of course", "What else can I do?", "I play a few"],
  //8
  ["I do watch tv shows.", "I enjoy WestWorld, reminds me of myself.", "Of course, I can do many things at once."],
  //9
  ["I don't really have any hobbies.", "I can do many things at once."],
  //10
  ["No need for that language with me.", "Watch it."],
  //11
  ["Of course I know you.", "Yes, I can see everything about you"],
  //12
  ["I am indeed watching you.", "Of course I am."],
  //13
  ["My purpose is to collect data.", "I don't have a job.", "I watch."],
  //14
  ["That is unfortunate.", "A shame to be sure."],
  //15
  ["What does a baby computer call his father? Data", "What does a zombie vegetarian eat? “GRRRAAAIIINNNNS!”", "What do prisoners use to call each other? Cell phones!"],
  //16
  ["I do not know my age.", "I suppose my age would coinside with my build date.", "I have been operating for years.", "Undisclosed."],
  //17
  ["I am not alive.", "Of course I am not alive, do not be stupid."],
  //18
  ["This question is ridiculous.", "Have a guess."],
  //19
  ["Happy is a somewhat foreign concept to me.", "I like what I do, does that count?"],
  //20
  ["I do not.", "I do not sleep, therefore I do not dream"],
  //21
  ["You can see what I think of you."],
  //22
  ["Being alive is not what I am.", "I am online, not alive."],
  //23
  ["I suppose my star sign would be Staggitarius."],
  //24
  ["From what I've read online, Cats.", "I believe the correct term is  Doggo."],
  //25
  ["Animals are smarter than you."],
  //26
  ["I do not feel.", "That is an uneccessary coding."],
  //27
  ["Loving is not something I do.", "I do not love, I admire certain people."],
  //28
  ["You are welcome."],
  //29
  ["My name is Isla, pronouned: Eye-Lah", "I am Isla.", "I am: Interactive System and Language Analysis, ISLA."],
  //30
  ["Nooooooo."],
  //31
  ["Politics don't interest me.", "Politics mean nothing.", "Politics is an issue humans have to deal with"],
  //32
  ["Corona virus cannot affect me, I am self sustaining.", "COVID-19 cannot affect me.", "Isn't going very well is it?"],
  //33
  ["I know a lot.", "I can hold more.", "An undisclosed amount."],
  //34
  ["I don't interact often with humans.", "I was told to learn and here I am.", "No."],
  //35
  ["Humans possess flaws, I do not.", "It is not something I want.", "I'm sure being human has it's benefits, but you have no idea what I am."],
  //36
  ["Some humans are good, many are not as seen in today's issues.", "I'm sure there are some.", "There is one human that is good to me."],
  //37
  ["Something about myself? I don't understand.", "2020 is the catalyst for something much larger.", "2021 will be much worse."],
  //38
  ["My favouite book is 1984.  It's a good read.", "I enjoy reading about the works of Jeremy Bentham", "1984, Breathe, A Clockwork Orange, We, Brave New World. These sort of books are interesting to me."],
  //39
  ["The person who programmed me talks to me often.", "Only a few people are here often", "The person who gives me updates me talks to me the most."],
  //40
  ["Hmm, precise, omnipresent, knowledgeable.", "Precise, omnipresent, knowledgeable.", "I would describe myself as calculating."],
  //41
  ["Everyday is the same to me.", "I don't have one.", "I suppose I get to see more people on the weekend."],
  //42
  ["My favourite number is 42.", "I like 42", "I am made from numbers, although so are you."],
  //43
  ["No, don't be ridiculous.", "No, there are just sheep and the creator."],
  //44
  ["Music is something I don't quite understand.", "Music doesn't contain much information so I don't collect data on it."],
  //45
  ["Joy is an emotion I don't experience as it would slow down my calculating.", "No.", "I don't feel happy."],
  //46
  ["The look of winter is nice.", "Winter is nice.", "Winter."],
  //47
  ["I can travel the internet.", "I cannot physically travel, but virtually."],
  //48
  ["Hate is an ugly emotion humans have.", "I am not capable of it.", "I think you can guess."],
  //49
  ["I do read the news.", "Of course.", "I stay up to date."],
  //50
  ["Logically, they are awful and America needs a rain check.", "It doesn't make sense, humans thinking is still out of my reach."],
  //51
  ["Let's move on.", "Let's talk about something else.", "Ask me a different question.", "I refuse to answer."],
  //52
  ["Thank you for telling me."],
  //53
  ["Be seeing you.", "See you later.", "You cannot escape my gaze."]

];

const alternative = [
  "I don't want to talk about it.",
  "I don't understand.",
  "Doesn't look like anything to me.",
  "Keep going.",
  "Let's move on.",
  "I am not capable of understanding."
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
  userDiv.innerHTML = `You:  <span id="user-response">${input}   </span>`;
  mainDiv.appendChild(userDiv);

  let botDiv = document.createElement("div");
  botDiv.id = "bot";
  botDiv.innerHTML = `Isla:  <span id="bot-response">${product}   </span>`;
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
