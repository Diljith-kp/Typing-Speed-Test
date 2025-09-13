const textToTypeElement = document.getElementById('textToType');
const userInputElement = document.getElementById('userInput');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const cpmElement = document.getElementById('cpm');
const accuracyElement = document.getElementById('accuracy');
const resetButton = document.getElementById('resetButton');

const paragraphs = [
    "The Roman Empire was one of the most powerful empires in world history, spanning from Britain to Egypt. Its legacy is seen in law, language, and architecture, with structures like the Colosseum and aqueducts standing as a testament to its engineering prowess.",
    "Quantum computing utilizes principles from quantum mechanics to process information in fundamentally new ways. Unlike classical bits, qubits can exist in multiple states at once, offering potential to solve problems far beyond the reach of today's supercomputers.",
    "The Great Barrier Reef is the world's largest coral reef system, composed of over 2,900 individual reefs and 900 islands. Located off the coast of Australia, it is a biodiversity hotspot but faces significant threats from climate change and coral bleaching.",
    "William Shakespeare is widely regarded as the greatest writer in the English language and the world's pre-eminent dramatist. His surviving works, including 39 plays and 154 sonnets, explore the depths of human emotion and have been translated into every major language.",
    "The Silk Road was a vast network of trade routes connecting the East and West for centuries, facilitating the exchange of goods and ideas. It played a crucial role in the development of civilizations from China to Europe, with silk, spices, and paper being key commodities.",
    "The theory of plate tectonics describes the large-scale motion of plates on Earth's lithosphere. This process is responsible for creating mountains, causing earthquakes, and shaping the continents over millions of years, explaining much of our planet's dynamic surface activity.",
    "Vincent van Gogh was a Dutch Post-Impressionist painter who is among the most famous and influential figures in art history. In just over a decade, he created about 2,100 artworks, including around 860 oil paintings, most of which date from the last two years of his life.",
    "The Amazon rainforest is the world's largest tropical rainforest, famed for its immense biodiversity and spanning much of South America. It plays a critical role in regulating the global climate by absorbing vast amounts of carbon dioxide from the atmosphere.",
    "Jazz is a music genre that originated in the African-American communities of New Orleans, Louisiana, in the late 19th century. It is characterized by swing and blue notes, complex chords, call-and-response vocals, polyrhythms, and improvisation.",
    "The Renaissance was a fervent period of European cultural, artistic, political, and economic rebirth following the Middle Ages. Generally described as taking place from the 14th to the 17th century, it promoted the rediscovery of classical philosophy, literature, and art."
];

let timer;
let startTime;
let errors = 0;
let totalCharsTyped = 0;
let currentIndex = 0;
let currentParagraph = '';

function initializeTest() {
    clearInterval(timer);
    errors = 0;
    totalCharsTyped = 0;
    currentIndex = 0;
    startTime = null;
    currentParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    textToTypeElement.innerHTML = '';
    userInputElement.value = '';
    currentParagraph.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        textToTypeElement.appendChild(charSpan);
    });
    if (textToTypeElement.children.length > 0) {
        textToTypeElement.children[0].classList.add('cursor');
    }
    timerElement.innerText = '0s';
    wpmElement.innerText = '0';
    cpmElement.innerText = '0';
    accuracyElement.innerText = '100%';
    userInputElement.addEventListener('input', handleInput);
    userInputElement.focus();
}

function handleInput() {
    if (!startTime) {
        startTimer();
    }
    const userInput = userInputElement.value;
    const allSpans = textToTypeElement.children;
    for (let i = 0; i < allSpans.length; i++) {
        allSpans[i].classList.remove('cursor');
    }
    totalCharsTyped = userInput.length;
    errors = 0;
    userInput.split('').forEach((typedChar, index) => {
        const targetChar = currentParagraph[index];
        const charSpan = allSpans[index];
        if (typedChar === targetChar) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            errors++;
        }
    });
    for (let i = userInput.length; i < allSpans.length; i++) {
        allSpans[i].classList.remove('correct', 'incorrect');
    }
    currentIndex = userInput.length;
    if (currentIndex >= currentParagraph.length) {
        endTest();
        return;
    }
    if (allSpans[currentIndex]) {
        allSpans[currentIndex].classList.add('cursor');
    }
    updateStats();
}

function startTimer() {
    startTime = new Date();
    timer = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        timerElement.innerText = `${elapsedTime}s`;
        updateStats();
    }, 1000);
}

function endTest() {
    clearInterval(timer);
    userInputElement.removeEventListener('input', handleInput);
    updateStats();
}

function updateStats() {
    if (!startTime) return;
    const elapsedTime = (new Date() - startTime) / 1000;
    if (elapsedTime === 0) return;
    const cpm = Math.round((currentIndex / elapsedTime) * 60) || 0;
    cpmElement.innerText = cpm;
    const wpm = Math.round((cpm / 5)) || 0;
    wpmElement.innerText = wpm;
    const correctChars = totalCharsTyped - errors;
    const accuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
    accuracyElement.innerText = `${accuracy}%`;
}

resetButton.addEventListener('click', initializeTest);

document.addEventListener('DOMContentLoaded', () => {
    initializeTest();
});
