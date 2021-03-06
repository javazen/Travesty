import {transform} from './travesty.js';

const TRACE = true;

let levelInput, levelValue = 2, decrementBtn, incrementBtn, transformBtn;

if (TRACE) console.log('index.js loaded');

document.addEventListener("DOMContentLoaded", function(event) {
  if (TRACE) console.log('DOMContentLoaded');
  decrementBtn = document.getElementById("decrement");
  decrementBtn.addEventListener('click', handleDecrement);
  incrementBtn = document.getElementById("increment");
  incrementBtn.addEventListener('click', handleIncrement);
  transformBtn = document.getElementById("transform");
  transformBtn.addEventListener('click', handleTransform);
  levelInput = document.getElementById('level');
  levelInput.value = levelValue;
  levelInput.addEventListener('input', handleLevelInput);
});

// when user changes level...
function handleLevelInput() {
  levelValue = +this.value;
}

// when user clicks decrement...
function handleDecrement() {
  levelValue -= 1;
  const levelText = document.getElementById("level");
  levelText.value = levelValue;
  const str = document.getElementById("inputtext").value;
  const newstr = transform(str, levelValue);
  updateOutput(newstr);
}

// when user clicks increment...
function handleIncrement() {
  levelValue += 1;
  const levelText = document.getElementById("level");
  levelText.value = levelValue;
  const str = document.getElementById("inputtext").value;
  const newstr = transform(str, levelValue);
  updateOutput(newstr);
}

// when user clicks transform...
function handleTransform() {
  const str = document.getElementById("inputtext").value;
  const newstr = transform(str, levelValue);
  updateOutput(newstr);
}

function updateOutput(str) {
  const outputtext = document.getElementById("outputtext");
  outputtext.value = str;
}


// @codekit-append "travesty.js";
