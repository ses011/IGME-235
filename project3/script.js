"use strict";


window.onload = e => {
    loadDice();
    setupDragging();
    loadCard();
    document.querySelector("#tutBtn").onmouseup = tutorial;

    tray = document.querySelectorAll("div#tray img");
}


// Enum of face types 
const FACES = Object.freeze({
    "solidWhite": 0,
    "solidColor": 1,
    "whiteCircle": 2,
    "colorCircle": 3,
    "colorDiagL": 4,
    "colorDiagR": 5,
    "whiteDiagL": 6,
    "whiteDiagR": 7
})

// Possible card combos
const CARDS = Object.freeze({
    0: [1, 0, 3, 1, 1, 3, 0, 1, 6, 0, 3, 7, 1, 6, 7, 1],
    1: [4, 6, 3, 7, 3, 7, 6, 5, 7, 4, 5, 3, 5, 3, 4, 6],
    2: [1, 2, 1, 5, 5, 7, 5, 7, 7, 5, 7, 5, 1, 2, 1, 2],
    3: [1, 5, 4, 1, 4, 6, 7, 5, 6, 4, 5, 7, 1, 6, 7, 1],
    4: [7, 4, 7, 4, 6, 5, 6, 5, 7, 4, 7, 4, 6, 5, 6, 5],
    5: [3, 7, 6, 3, 7, 5, 4, 6, 6, 4, 5, 7, 2, 6, 7, 2],
    6: [1, 5, 4, 1, 5, 5, 4, 4, 6, 6, 7, 7, 1, 6, 7, 1],
    7: [4, 2, 3, 7, 3, 4, 7, 2, 2, 5, 6, 3, 5, 3, 2, 6],
    8: [3, 6, 7, 3, 4, 1, 1, 5, 7, 1, 1, 6, 3, 5, 4, 3],
    9: [5, 7, 5, 7, 7, 5, 7, 5, 5, 7, 5, 7, 7, 5, 7, 5],
    10: [5, 4, 5, 4, 7, 6, 7, 6, 5, 4, 5, 4, 7, 6, 7, 6]
})

let selectedDice = null;
let diceList = [];
let tray;
let card;
let dropSound = new Howl({
    src: ["sounds/frogblock.wav"]
});

// Create and set dice faces
function loadDice() {
    let doMouseDown = function(e) {
        e.preventDefault();
        selectedDice = e.target;
        selectedDice.style.zIndex = 1000;
    };

    let diceDiv = document.querySelector("#dice");

    for (let i = 0; i < 16; i++) {
        let tempDice = new Dice(i);
        diceList.push(tempDice);
        let dice = `<img id=${i} class="${tempDice.getFace()}">`;

        diceDiv.innerHTML += dice;
    }

    for (let img of document.querySelectorAll("div#dice img")) {
        img.onmousedown = doMouseDown;
        img.ondblclick = swap;
        let vw = window.innerWidth;

        setFaceImg(img)
        let id = parseInt(img.id);
        setPosition(img, ((vw * 0.11) * (id % 4)) + (vw * 0.5), ((vw * 0.11) * Math.floor(id/4)) + 50);
    }
}

// Select a card and display it
function loadCard() {
    let prompt = document.querySelector("#prompt");
    card = Math.round(Math.random() * 10);

    for (let i = 0; i < 16; i++) {
        let pattern = Object.keys(FACES)[CARDS[card][i]];
        prompt.innerHTML += `<img src="images/card/${pattern}.png"></img>`
    }
}

function setPosition(img, left, top) {
    img.style.left = left + "px";
    img.style.top = top + "px";
}

// partially from magnetic poetry, allows tiles to be dragged around
function setupDragging() {
    document.onmousemove = function(e) {
        e.preventDefault();
        if (selectedDice) {
            let mousePos = getMousePos(document.body, e);

            mousePos.x -= selectedDice.clientWidth/2;
            mousePos.y -= selectedDice.clientWidth/2;
            setPosition(selectedDice, mousePos.x, mousePos.y);
        }
    };

    document.onmouseup = function(e) {
        if (selectedDice) {
            dropSound.play();
            selectedDice.style.zIndex = 999;

            // Checks if the selected dice is within a range of a tray location
            for (let space of tray) {
                let coords = space.getBoundingClientRect();
                console.log(coords);
                let left = selectedDice.getBoundingClientRect().left; 
                let top = selectedDice.getBoundingClientRect().top;

                // Get position value from the selected dice
                

                // Set position and give class value (to check for accuracy) if within range
                if (left < coords.left + 25 && left > coords.left - 25 && top < coords.top + 25 && top > coords.top - 25) {
                    let position = document.querySelector(`#${space.id}`);
                    selectedDice.style.left = (coords.left + 7) + "px";
                    selectedDice.style.top = (coords.top + 7) + "px";

                    let classes = selectedDice.classList.value;
                    if (classes.includes(" ")) {
                        selectedDice.classList.value = classes.split(" ")[0] + " " + position.id;
                    }
                    else {
                        selectedDice.classList.add(position.id);
                    }
                }
            } 

            // check accuracy of puzzle
            let correct = 0;
            for (let dice of document.querySelectorAll(`div#dice img`)) {
                let location = dice.classList[1];
                if (location) {
                    location = location.split('');
                    let pattern = CARDS[card];
                    let index = ((parseInt(location[1]) - 1) * 4) + parseInt(location[2]) - 1;
                    
                    if (Object.keys(FACES)[pattern[index]] == dice.classList[0]) {
                        correct++;
                    }
                    else {
                        console.log(Object.keys(FACES)[pattern[index]], dice.classList[0])
                    }
                }
            }

            console.log(correct);

            if (correct == 16) {
                window.alert("You solved it!");
            }
        }

        

        selectedDice = null;
    };
}

// Helper from magnetic poetry
function getMousePos(parentElement, event) {
    let rect = parentElement.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function tutorial(){
    return window.open("tutorial.html", "How to play", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+window.innerWidth/2+', height='+window.innerHeight/2+', top='+window.innerHeight/3+', left='+window.innerWidth/3)
}

// Double click event function - Rerolls the visible face of the clicked dice
function swap(e) {
    e.preventDefault();

    let dice = diceList[e.target.id];
    let val = FACES[dice.getFace()] + 1;
    if (val == 8) {
        val = 0;
    }
    dice.face = Object.keys(FACES)[val]

    let classes = e.target.classList.value

    if (classes.includes(" ")) {
        e.target.classList.value = dice.face + " " + classes.split(" ")[1] ;
    }
    else {
        e.target.classList.value = dice.face;
    }

    setFaceImg(e.target);
}

// Sets the innerHTML of a dice image to it's face sprite
function setFaceImg(img) {
    let face = diceList[img.id].getFace();
    
    switch (face) {
        case "solidColor":
            img.src = "images/dice/solidColor.png";
            img.alt = face;
            break;
        case "solidWhite":
            img.src = "images/dice/solidWhite.png";
            img.alt = face;
            break;
        case "colorCircle":
            img.src = "images/dice/colorCircle.png";
            img.alt = face;
            break;
        case "whiteCircle":
            img.src = "images/dice/whiteCircle.png";
            img.alt = face;
            break;
        case "colorDiagL":
            img.src = "images/dice/colorDiagL.png";
            img.alt = face;
            break;
        case "colorDiagR":
            img.src = "images/dice/colorDiagR.png";
            img.alt = face;
            break;
        case "whiteDiagL":
            img.src = "images/dice/whiteDiagL.png";
            img.alt = face;
            break;
        case "whiteDiagR":
            img.src = "images/dice/whiteDiagR.png";
            img.alt = face;
            break;
    }
}