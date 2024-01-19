"use strict";

window.onload = (e) => {
    document.querySelector("#submit").onclick = searchButtonClicked;
    let count = localStorage.getItem(countKey);
    let category = localStorage.getItem(categoryKey);
    let type = localStorage.getItem(typeKey);

    if (count) {document.querySelector("#searchcount").value = count}
    else {document.querySelector("#searchcount").value = 10}

    if (category) {document.querySelector(`option[value="${category}"]`).selected = true}
    else {document.querySelector(`option[value="cany"]`).selected = true}

    if (type) {document.querySelector(`option[value="${type}"]`).selected = true}
    else {document.querySelector(`option[value="tany"]`).selected = true}


    document.querySelector("#searchcount").onchange = e => {localStorage.setItem(countKey, e.target.value)};
    document.querySelector("#categories").onchange = e => {localStorage.setItem(categoryKey, e.target.value)}
    document.querySelector("#type").onchange = e => {localStorage.setItem(typeKey, e.target.value)}

};

// Keys for local storage
const countKey = "ses1431count";
const categoryKey = "ses1431category";
const typeKey = "ses1431type";




function searchButtonClicked(){
    document.querySelector("#submit").disabled = true;

    document.querySelector("#questions").innerHTML = " ";

    const BASE_URL = "https://opentdb.com/api.php?amount=";

    let count = document.querySelector("#searchcount").value;
    if (isNaN(count)) {
        document.querySelector("#questions").innerHTML = "\t Not an integer, enter data again";
        return;
    }
    else if (count <= 0){
        document.querySelector("#questions").innterHTML = "\t Number must be positive, enter data again";
        return;
    }

    let url = BASE_URL + count;

    let category = document.querySelector("#categories").value;
    if (!category.includes("any")) url += `&category=${category}`;

    let type = document.querySelector("#type").value;
    if (!type.includes("any")) url += `&type=${type}`;

    getData(url);
}
  
function getData(url) {
    console.log(url);
    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    document.querySelector("#questions").innterHTML = "\t Loading questions";

    let xhr = e.target;
    
    // Handles errors, displays a relevant error message, reactivates button, returns
    let obj = JSON.parse(xhr.responseText);
    if(!obj.results || obj.results.length == 0) {
        if (obj.response_code === 1) {
            document.querySelector("#questions").innerHTML = "\t Not enough questions exist for this input- enter a smaller number";
        }
        else if (xhr.status == 429) {
            document.querySelector("#questions").innerHTML = "\t Too many requests- wait a few seconds then try again";
        }
        else {
            document.querySelector("#questions").innerHTML = "\t No results- try a different value";
            console.log("oops");
        }
        document.querySelector("#submit").disabled = false;
        return;
    }

    console.log(obj);

    let result = obj.results;
    console.log(result);

    let qCount = 0;

    // goes through all q (questions) given by API
    for (let q of result) {
        let ask = q.question;
        console.log(ask);

        let line = `<div class='prompt'> ${ask}`;
        let answers = "";
        // gets all possible options for multiple choice
        if (q.type == "multiple"){
            let options = [];
            for (let wrong of q.incorrect_answers) {
                options.push(wrong);
            }
            answers += shuffle(options, q.correct_answer, qCount);
        }
        // gets correct answer for true/false
        else {
            answers += trueFalse(q.correct_answer, qCount);
        }

        qCount++;
        document.querySelector("#questions").innerHTML += line + answers + `</div>`;
    }

    document.querySelector("#submit").disabled = false;
}

function dataError(e){
    console.log("uhoh, something borked");
}

// Sets up true/false questions to have the same order of options 
function trueFalse(correct, num) {
    let options = `<br><input type="radio" class="TF `;

    // True option
    if (correct === "True") {
        options += `correct"`;
    }
    else {
        options += 'incorrect"';
    }
    options += ` name="${num}" value="True">`;
    options += `<span class="label">True</span>`;

    // False option
    options += `<br><input type="radio" class="TF `;
    if (correct === "False") {
        options += `correct"`;
    }
    else {
        options += `incorrect"`;
    }
    options += `name="${num}" value="False">`;
    options += `<span class="label">False</span>`;

    return options;
}

// Sets up and randomizes order of multiple choice radio buttons
function shuffle(answers, correct, num) {
    let selections = "";
    let index = Math.random() * 4;
    let options = [...answers.slice(0, index), correct, ...answers.slice(index)];
    for (let o of options) {
        let c = "incorrect";
        if (o === correct) {
            c = "correct"
        }
        selections += `<br><input type="radio" class="multiple ${c}" name="${num}" value="${o}">`;
        selections += `<span class="label">${o}</span>`;
    }
    return selections;
}

