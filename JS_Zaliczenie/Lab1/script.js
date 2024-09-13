// Pobieranie elementu ze struktury DOM: document.querySelector(selektor) document.querySelectorAll(selektor)

// Nasłuchiwanie na zdarzenia: document.addEventListener(nazwaZdarzenia, callback)

// Tworzenie nowego elementu HTML document.createElement(element)

// Dodawanie elementu HTML do struktury dokumentu
//parentElement.appendChild(child), element.insertBefore(newElement), [...]

// Usuwanie elementu HTML ze struktury dokumentu
//parentElement.removeChild(child), [...]

let inputs = Array.from(document.querySelectorAll("input"));
const button = document.querySelector("#count-btn");
const addButton = document.querySelector("#add-btn");
const removeButton = document.querySelector("#remove-btn");
const sumResult = document.querySelector("#sum");
const avgResult = document.querySelector("#avg");
const maxResult = document.querySelector("#max");
const minResult = document.querySelector("#min");

const countSum = () => {
  let sum = 0;
  inputs.forEach((input) => (sum += +input.value));
  sumResult.textContent = sum;

  return sum;
};

const countAvg = (sum) => {
  const average = sum / +inputs.length;
  avgResult.textContent = average;
};

const countMax = () => {
  const max = Math.max(...inputs.map((input) => +input.value));
  maxResult.textContent = max;
};

const countMin = () => {
  const min = Math.min(...inputs.map((input) => +input.value));
  minResult.textContent = min;
};

const calculate = () => {
  const sum = countSum();
  const avg = countAvg(sum);
  const max = countMax();
  const min = countMin();
};

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    calculate();
  });
});

const addEvents = () => {
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      calculate();
    });
  });
};

addButton.addEventListener("click", () => {
  const newInput = document.createElement("input");
  document.getElementById("myList").appendChild(newInput);
  inputs = Array.from(document.querySelectorAll("input"));
  addEvents();
  calculate();
});

removeButton.addEventListener("click", () => {
  const list = document.getElementById("myList");
  let lastElement = list.lastElementChild;
  list.removeChild(lastElement);
  inputs = Array.from(document.querySelectorAll("input"));
  addEvents();
  calculate();
});
