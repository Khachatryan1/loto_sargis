const ticketContainer = document.getElementById('ticket-container');
const usedNumbers = document.getElementById('used-numbers-container');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');

let currentNumber;
let interval;
let matchingNumber = [];

reset();

function createTicket () {
    fillTicketRow(ticketRows[0]);
    fillTicketRow(ticketRows[1]);
    fillLastRow(ticketRows);
}

function fillTicketRow (subarray) {
    const rowNumbers = shuffle(numbers).splice(0, 5);
    const rowArray = rowNumbers.concat(Array(4).fill(null));
    subarray.push(...shuffle(rowArray));
}

function fillLastRow (subarray) {
    const lastRowNumbers = shuffle(numbers).splice(0, 5);
    subarray[2] = Array(9).fill('');

    for (let i = 0; i < ticketRows[2].length; i++) {
        if (subarray[0][i] === null && subarray[1][i] === null) {
            subarray[2][i] = lastRowNumbers.pop();
        } else if (typeof subarray[0][i] === 'number' && typeof subarray[1][i] === 'number') {
            subarray[2][i] = null;
        }
    }
    
    while (lastRowNumbers.length > 0) {
        const emptyIndex = subarray[2].indexOf('');
        subarray[2][emptyIndex] = lastRowNumbers.pop();
    }
}

function shuffle(array) {
   return array.sort(() => Math.random() - 0.5);
}

function buttonControl (show, hide) {
    hide.style.display = 'none';
    show.style.display = 'block';
}

function startGeneretNumbers () {
    buttonControl(resetButton, startButton);

    let usedNumbersArray = [];
    let numbers = [];

    for (let i = 1; i <= 90; i++) {
        numbers.push(i);
    }

    interval = setInterval(() => {
        if (numbers.length > 0) {
            const randomNumber = Math.floor(Math.random() * numbers.length);
            const number = numbers.splice(randomNumber, 1)[0];

            usedNumbersArray.unshift(number);

            if (usedNumbersArray.length > 7) {
                usedNumbersArray.pop();
            }
            currentNumber = number;

            usedNumbers.innerHTML = usedNumbersArray.map(elem =>  `<div class='used-numbers'>${elem}</div>`).join('');
        } else {
            clearInterval(interval);
        }
    }, 2000);
}

function reset() {
    buttonControl(startButton, resetButton);

    ticketRows = [[], [], []];
    numbers = [];

    for (let i = 1; i <= 90; i++) {
        numbers.push(i);
    }

    createTicket();
    displayTicket(ticketRows);

    clearInterval(interval);
}

function yourNumber (cell) {
    if (cell.innerText === currentNumber + '') {
        matchingNumber.push(cell.innerText);

        if (matchingNumber.length === 15) {
            clearInterval(interval);
            ticketContainer.innerHTML = `<div class='you-won'>you won</div>`;
        }
        cell.style.backgroundColor = 'red';
    }
}

function displayTicket (ticketRows) {
    ticketContainer.innerHTML = '';
    usedNumbers.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'loto-ticket';

    ticketRows.forEach(subArray => {
        const row = document.createElement('tr');

        subArray.forEach(element => {
            const cell = document.createElement('td');

            cell.innerText = element === null ? '' : element;
            cell.className = element === null || element === '' ?
                'fields empty-field' : 'fields field-with-number'; 
            
            if (cell.className === 'fields field-with-number') {
                cell.onclick = () => {
                    yourNumber(cell);
                }
            }
            
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
    ticketContainer.appendChild(table);    
}




