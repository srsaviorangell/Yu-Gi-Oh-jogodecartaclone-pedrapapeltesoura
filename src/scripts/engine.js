const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scorebox: document.getElementById("score_point"),
    },
    cardSprites: {
        avatar: document.getElementById("card-imagem"),
        nome: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    action: {
        button: document.getElementById("next-duel"),
    },
};

const PlayerSides = {
    player1: "player-card",
    computer: "computer-card",
};
const caminhoDasImg = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        typo: "paper",
        img: `${caminhoDasImg}dragon.png`,
        windOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "dark magician",
        typo: "paper",
        img: `${caminhoDasImg}magician.png`,
        windOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "exodia",
        typo: "scissors",
        img: `${caminhoDasImg}exodia.png`,
        windOf: [0],
        loseOf: [1],
    },
];

async function getRandomCardId() {
const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

function createCardImage(IdCard, fieldside) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldside === PlayerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardField(cardImage.getAttribute("data-id"));
        });
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
    }
    return cardImage;
}

async function setCardField(cardId) {
    await removeAllCardsImages();
    let computerCardId = getRandomCardId();
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    const duelResults = await checkDuelResults(cardId, computerCardId);

    updateScore();
    drawButton(duelResults);
}

function drawButton(text) {
    state.action.button.innerText = text;
    state.action.button.style.display = "block";
}

function updateScore() {
    state.score.scorebox.innerText = ` win: ${state.score.playerScore} | Lose:${state.score.computerScore} `;
}

function removeAllCardsImages() {
    let cards = document.querySelector(".card-box.framed computer-cards");
    let imgElement = cards.querySelectorAll("img");
    imgElement.forEach((img) => img.remove());

    cards = document.querySelector(".card-box.framed player-cards");
    imgElement = cards.querySelectorAll("img");
    imgElement.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if (playerCard.windOf.includes(computerCardId)) {
        duelResults = "WIN";
        playAudio(duelResults);
        state.score.playerScore++;
    }

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "LOSE";
        playAudio(duelResults);
        state.score.computerScore++;
    }
    return duelResults;
}

function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.nome.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "attribute :" + cardData[index].typo;
}

async function drawCards(cardNumbers, fieldside) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = getRandomCardId();
        const cardImage =  await createCardImage(randomIdCard, fieldside);

        document.getElementById(fieldside).appendChild(cardImage);
    }
}

function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.action.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    drawCards(5, PlayerSides.player1);
    drawCards(5, PlayerSides.computer);
}

// Chame a função init() para iniciar o jogo
init();