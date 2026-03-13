//LOGIC STEPS//
//JS MENTOR CHAT: https://chatgpt.com/share/69b374c6-7548-8011-acbf-89e2547f1669
//1. Make variables for the sky area, the SVG line area, the selected words box, the poem output, and the reset button.
//2. Make an array that stores all the possible words for the constellation.
//3. Make empty arrays to store the words the user clicks and the positions of those selected stars.
//4. Make a function to shuffle the words so the set is different each time.
//5. Make a function to pick a certain number of words from the word bank.
//6. Make a function to generate random x and y positions so the words appear in different places in the sky.
//7. Make a function to clear the sky, clear the lines, reset the selected words array, reset the selected points array, and reset the poem panel text.
//8. Make a function that creates the star words as buttons, places them randomly in the sky, and adds a click event listener to each one.
//9. Make a function for when a star is clicked:
    //check if it was already selected
    // if not, mark it as selected
    // save the word into the selected words array
    // get the star’s position and save that into the selected points array
    // update the selected words display
    // redraw the constellation lines
    // if 4 or more words are selected, generate the poem
//10. Make a function to update the poem panel so it shows the words the user has collected.
//11. Make a function to draw SVG lines between each selected word position.
//12. Make a function to randomly choose a poem template and insert the selected words into it.
//13. Make a reset button event listener that runs the function to create a new sky.
//14. When the page first loads, run the function that creates the stars.


const sky = document.getElementById("sky");
const linesSvg = document.getElementById("lines");
const selectedWordsBox = document.getElementById("selectedWords");
const poemOutput = document.getElementById("poemOutput");
const resetBtn = document.getElementById("resetBtn");

const wordBank = [
  "memory", "ocean", "signal", "dream", "static", "echo",
  "light", "silence", "orbit", "language", "fragment", "glow",
  "shadow", "velvet", "machine", "starlight", "whisper", "blue",
  "night", "pulse", "mist", "thread", "moon", "breath"
];

let selectedWords = [];
let selectedPoints = [];

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickWords(count) {
  return shuffleArray(wordBank).slice(0, count);
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function clearSky() {
  sky.innerHTML = "";
  linesSvg.innerHTML = "";
  selectedWords = [];
  selectedPoints = [];
  selectedWordsBox.textContent = "No stars selected yet.";
  poemOutput.textContent = "Your poem will appear after you choose 4 words.";
}

function createStars() {
  clearSky();

  const words = pickWords(10);

  words.forEach((word, index) => {
    const star = document.createElement("button");
    star.className = "word-star";
    star.type = "button";
    star.textContent = word;

    const x = randomRange(12, 88);
    const y = randomRange(14, 86);

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.animationDelay = `${index * 0.35}s`;

    star.addEventListener("click", () => handleStarClick(star, word));

    sky.appendChild(star);
  });
}

function handleStarClick(star, word) {
  if (star.classList.contains("selected")) {
    return;
  }

  star.classList.add("selected");
  selectedWords.push(word);

  const skyRect = sky.getBoundingClientRect();
  const starRect = star.getBoundingClientRect();

  const point = {
    x: starRect.left - skyRect.left + starRect.width / 2,
    y: starRect.top - skyRect.top + starRect.height / 2
  };

  selectedPoints.push(point);

  updateSelectedWords();
  drawLines();

  if (selectedWords.length >= 4) {
    generatePoem();
  }
}

function updateSelectedWords() {
  selectedWordsBox.textContent = selectedWords.join(" • ");
}

function drawLines() {
  linesSvg.innerHTML = "";

  for (let i = 0; i < selectedPoints.length - 1; i++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", selectedPoints[i].x);
    line.setAttribute("y1", selectedPoints[i].y);
    line.setAttribute("x2", selectedPoints[i + 1].x);
    line.setAttribute("y2", selectedPoints[i + 1].y);
    line.setAttribute("stroke", "rgba(214, 224, 255, 0.65)");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-linecap", "round");
    linesSvg.appendChild(line);
  }
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePoem() {
  const chosen = shuffleArray(selectedWords);
  const [a, b, c, d] = chosen;

  const templates = [
    `${a} drifts through ${b}\nwhile ${c} gathers the shape of ${d}.`,
    `Between ${a} and ${b},\n${c} becomes a quiet form of ${d}.`,
    `${a} remembers ${b};\n${c} orbits softly around ${d}.`,
    `In the dark, ${a} glows like ${b},\nand ${c} learns the language of ${d}.`,
    `${a} speaks to ${b}\nwhile ${c} fades into ${d}.`
  ];

  poemOutput.textContent = pickRandom(templates);
}

resetBtn.addEventListener("click", createStars);

window.addEventListener("resize", () => {
  if (selectedPoints.length > 0) {
    const selectedStarElements = document.querySelectorAll(".word-star.selected");
    selectedPoints = [];

    selectedStarElements.forEach((star) => {
      const skyRect = sky.getBoundingClientRect();
      const starRect = star.getBoundingClientRect();

      selectedPoints.push({
        x: starRect.left - skyRect.left + starRect.width / 2,
        y: starRect.top - skyRect.top + starRect.height / 2
      });
    });

    drawLines();
  }
});

createStars();