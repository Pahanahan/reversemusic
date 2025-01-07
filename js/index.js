import array from "./array.js";

const sectionBox = document.querySelector(".section__box");
const main = document.querySelector(".main");
const mainBoxCharts = document.querySelector(".main__box-charts");
const mainContainerPlay = document.querySelector(".main__container-play");
const mainContainerRecord = document.querySelector(".main__container-record");
const mainContainerRepeat = document.querySelector(".main__container-repeat");
const mainRepeat = document.querySelector(".main__repeat");
const mainAnswer = document.querySelector(".main__answer");
const mainAnswerForm = document.querySelector(".main__answer form");
const input = mainAnswerForm.querySelector("input");
const winItem = main.querySelector(".main__win");

let arrayMusic;

if (localStorage.getItem("arrayMusic")) {
  arrayMusic = JSON.parse(localStorage.getItem("arrayMusic"));
  if (arrayMusic.length < array.length) {
    arrayMusic = [...arrayMusic, ...array.slice(arrayMusic.length)];
  }
} else {
  arrayMusic = array;
}

console.log(arrayMusic);

let dataNumber;
let allChartLength;

function renderMusicItem(arr) {
  arr.forEach((item) => {
    const itemActive = item.active ? "section__box-item--active" : "";
    const itemCheck = item.done ? "&check;" : "";

    const html = `
      <div class="section__box-item" data-number="${item.number}" 
      data-active="${item.active}" data-done="${item.done}">
        <div class="section__box-item-first">${item.number}</div>
          <div class="section__box-item-second ${itemActive}">
          ${itemCheck}
        </div>
      </div>
    `;

    sectionBox.insertAdjacentHTML("beforeend", html);
  });
}

renderMusicItem(arrayMusic);

sectionBox.addEventListener("click", addMainContainer);
mainRepeat.addEventListener("click", startRecordFromBegin);

function addMainContainer(e) {
  mainAnswerForm.addEventListener("submit", checkMusic);
  if (e.target.closest(".section__box-item")) {
    const item = e.target.closest(".section__box-item");

    dataNumber = Number(item.getAttribute("data-number"));
    const dataActive = item.getAttribute("data-active");
    // const dataDone = item.getAttribute("data-done");

    // console.log(dataNumber);

    if (dataActive === "true") {
      main.classList.remove("hidden");
      sectionBox.classList.add("hidden");

      const mainBoxTime = document.querySelector(".main__box-time");

      mainBoxTime.textContent = arrayMusic[dataNumber - 1].timeRecord;

      for (
        let i = 0;
        i < arrayMusic[dataNumber - 1].musicReversed.length;
        i++
      ) {
        const chartHTML = `
          <div class="main__box-chart" data-current='${i}'></div>
        `;
        mainBoxCharts.insertAdjacentHTML("beforeend", chartHTML);
      }

      allChartLength = document.querySelectorAll(".main__box-chart").length;

      document
        .querySelector(".main__box-chart")
        .classList.add("main__box-chart--active");

      mainContainerPlay.addEventListener("click", playChartMusic);
      mainContainerRecord.addEventListener("click", recordChartMusic);
    }
  }
}

let currentChart = 0;
let audioChunks = [];
let audioArr = [];
let mediaRecorder;

function playChartMusic() {
  const audio = new Audio(
    arrayMusic[dataNumber - 1].musicReversed[currentChart]
  );
  audio.play();
}

async function getMicrophoneAccess() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    return stream;
  } catch (error) {
    console.error(`Error: Невозможно получить доступ к микрофону`);
  }
}

async function recordChartMusic() {
  // if (mediaRecorder && mediaRecorder.state === "recording") {
  //   mediaRecorder.stop();
  // }

  mainContainerRecord.removeEventListener("click", recordChartMusic);

  checkFinishRecord();

  audioChunks = [];

  const stream = await getMicrophoneAccess();
  if (!stream) return;

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.start();
  console.log("Запись началась");

  function stopRecording() {
    mediaRecorder.stop();
    console.log("Запись остановлена");

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const reversedAudioUrl = await reverseAudio(audioBlob);
      console.log("Записанный аудиофайл доступен по URL:", reversedAudioUrl);

      audioArr.push(reversedAudioUrl);
      console.log(audioArr);
    };
  }

  setTimeout(() => {
    stopRecording();
    currentChart++;
    updateDots(currentChart);
    mainContainerRecord.addEventListener("click", recordChartMusic);
    if (currentChart === arrayMusic[dataNumber - 1].times.length) {
      mainContainerRecord.removeEventListener("click", recordChartMusic);
    }
  }, arrayMusic[dataNumber - 1].times[currentChart] * 1000);
}

function updateDots(currentChart) {
  const mainBoxCartsItems = document.querySelectorAll(".main__box-chart");

  if (currentChart <= arrayMusic[dataNumber - 1].times.length - 1) {
    mainBoxCartsItems.forEach((item) => {
      item.classList.remove("main__box-chart--active");
    });
    mainBoxCartsItems[currentChart].classList.add("main__box-chart--active");
  }
}

function checkFinishRecord() {
  if (currentChart === arrayMusic[dataNumber - 1].times.length - 1) {
    mainContainerPlay.removeEventListener("click", playChartMusic);
    mainContainerRecord.removeEventListener("click", recordChartMusic);
    mainContainerRepeat.addEventListener("click", playRecords);
  }
}

async function playRecords() {
  console.log(audioArr);

  for (const audio of audioArr) {
    console.log(audio);
    const audioMP3 = new Audio(audio);
    await playAudio(audioMP3);
  }
}

function playAudio(audio) {
  return new Promise((resolve) => {
    audio.play();
    audio.onended = () => {
      resolve();
    };
  });
}

function checkMusic(e) {
  e.preventDefault();
  const answer = input.value.toLowerCase();

  if (arrayMusic[dataNumber - 1].answer.includes(answer)) {
    const audioWin = new Audio(arrayMusic[dataNumber - 1].music);
    winItem.classList.remove("hidden");
    winItem.classList.add("main__win");
    winItem.classList.remove("main__lost");
    winItem.textContent = `Правильный ответ: ${
      arrayMusic[dataNumber - 1].answer[0]
    }`;
    input.value = "";
    // mainAnswerForm.removeEventListener("submit", checkMusic);
    mainAnswer.classList.add("hidden");

    playAudio(audioWin);

    setTimeout(() => {
      afterWin();
      saveToLocalStorage();
      renderMusicItem(arrayMusic);
    }, arrayMusic[dataNumber - 1].timeMusic * 1000);
  } else {
    winItem.classList.remove("hidden");
    winItem.classList.add("main__lost");
    winItem.textContent = "Ответ неверный";

    const audioErorr = new Audio("./audio/error.mp3");
    audioErorr.play();

    setTimeout(() => {
      winItem.classList.add("hidden");
    }, 1000);
  }
}

function afterWin() {
  main.classList.add("hidden");
  sectionBox.classList.remove("hidden");

  arrayMusic[dataNumber - 1].done = true;
  if (arrayMusic[dataNumber]) {
    arrayMusic[dataNumber].active = true;
  }

  sectionBox.innerHTML = "";
  mainBoxCharts.innerHTML = "";
  winItem.classList.add("hidden");
  winItem.classList.remove("main__win");
  mainAnswer.classList.remove("hidden");
}

function startRecordFromBegin() {
  currentChart = 0;
  audioChunks = [];
  audioArr = [];
  mediaRecorder = null;
  updateDots(currentChart);
  mainContainerPlay.addEventListener("click", playChartMusic);
  mainContainerRecord.addEventListener("click", recordChartMusic);
}

function saveToLocalStorage() {
  localStorage.setItem("arrayMusic", JSON.stringify(arrayMusic));
}

////////////////////////////////////////

function bufferToWav(audioBuffer) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  let result;
  let offset = 0;
  let channelData = [];
  const length = audioBuffer.length * numberOfChannels * (bitDepth / 8);

  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, offset, "RIFF");
  offset += 4;
  view.setUint32(offset, 36 + length, true);
  offset += 4;
  writeString(view, offset, "WAVE");
  offset += 4;
  writeString(view, offset, "fmt ");
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4; // SubChunk1Size
  view.setUint16(offset, format, true);
  offset += 2; // AudioFormat
  view.setUint16(offset, numberOfChannels, true);
  offset += 2; // NumChannels
  view.setUint32(offset, sampleRate, true);
  offset += 4; // SampleRate
  view.setUint32(offset, sampleRate * numberOfChannels * (bitDepth / 8), true);
  offset += 4; // ByteRate
  view.setUint16(offset, numberOfChannels * (bitDepth / 8), true);
  offset += 2; // BlockAlign
  view.setUint16(offset, bitDepth, true);
  offset += 2; // BitsPerSample
  writeString(view, offset, "data");
  offset += 4;
  view.setUint32(offset, length, true);
  offset += 4;

  // Write interleaved data
  for (let channel = 0; channel < numberOfChannels; channel++) {
    channelData.push(audioBuffer.getChannelData(channel));
  }

  const interleaved = interleave(channelData);
  interleaved.forEach((sample) => {
    const value = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true);
    offset += 2;
  });

  result = new Blob([buffer], { type: "audio/wav" });
  return result;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function interleave(input) {
  const length = input[0].length;
  const result = new Float32Array(length * input.length);
  let index = 0;

  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < input.length; channel++) {
      result[index++] = input[channel][i];
    }
  }

  return result;
}

async function reverseAudio(file) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    audioBuffer.getChannelData(i).reverse();
  }

  const reversedBlob = bufferToWav(audioBuffer);
  const reversedAudioUrl = URL.createObjectURL(reversedBlob);

  return reversedAudioUrl;
}
