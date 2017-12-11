'use strict';

const sudokuSeq = "1,2,3,4,5,6,7,8,9";
var sudoku = new Array(81).fill(0);

function gameGrid(sudoku) {
    var i = 0;
    var grid = document.createElement("div");
    grid.className = "body";
    for (var r = 0; r < 9; r++) {
        var row = document.createElement("div");
        row.className = "row";
        for (var c = 0; c < 9; c++) {
            var cell = document.createElement("div");
            cell.className = "cell";
            if (c === 2 || c === 5) {
                cell.className += " right";
            }
            if (r === 2 || r === 5) {
                cell.className += " bottom";
            }
            cell.innerHTML = sudoku[i++];
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }

    var game = document.getElementById("game");
    while (game.firstChild) {
        game.removeChild(game.firstChild);
    }
    game.appendChild(grid);

    return grid;
}

function getRow(cell) {
    return Math.floor(cell / 9);
}

function getColumn(cell) {
    return cell % 9;
}

function getSquare(cell) {
    return Math.floor(getRow(cell) / 3) * 3 + Math.floor(getColumn(cell) / 3);
}

function isPossibleRow(sudoku, row, number) {
    for (var i = 0; i < 9; i++) {
        if (sudoku[row * 9 + i] === number) {
            return false;
        }
    }
    return true;
}

function isPossibleColumn(sudoku, column, number) {
    for (var i = 0; i < 9; i++) {
        if (sudoku[column + 9 * i] === number) {
            return false;
        }
    }
    return true;
}

function isPossibleSquare(sudoku, square, number) {
    for (var i = 0; i < 9; i++) {
        if (sudoku[Math.floor(square / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (square % 3)] === number) {
            return false;
        }
    }
    return true;
}

function isPossibleNumber(sudoku, cell, number) {
    return isPossibleRow(sudoku, getRow(cell), number) && isPossibleColumn(sudoku, getColumn(cell), number) && isPossibleSquare(sudoku, getSquare(cell), number);
}

function isCorrectRow(sudoku, row) {
    var rowTemp = [];
    for (var i = 0; i < 9; i++) {
        rowTemp[i] = sudoku[row * 9 + i];
    }
    rowTemp.sort();
    return rowTemp.join() === sudokuSeq;
}

function isCorrectColumn(sudoku, column) {
    var colTemp = [];
    for (var i = 0; i < 9; i++) {
        colTemp[i] = sudoku[column + i * 9];
    }
    colTemp.sort();
    return colTemp.join() === sudokuSeq;
}

function isCorrectSquare(sudoku, square) {
    var squareTemp = [];
    for (var i = 0; i < 9; i++) {
        squareTemp[i] = sudoku[Math.floor(square / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (square % 3)];
    }
    squareTemp.sort();
    return squareTemp.join() === sudokuSeq;
}

function isSolved(sudoku) {
    for (var i = 0; i < 9; i++) {
        if (!isCorrectSquare(sudoku, i) || !isCorrectRow(sudoku, i) || !isCorrectColumn(sudoku, i)) {
            return false;
        }
    }
    return true;
}

function getPossibleValues(sudoku, cell) {
    var possible = [];
    for (var i = 1; i <= 9; i++) {
        if (isPossibleNumber(sudoku, cell, i)) {
            possible.push(i);
        }
    }
    return possible;
}

function getRandomPossibleValues(possible, cell) {
    var randomPicked = Math.floor(Math.random() * possible[cell].length);
    return possible[cell][randomPicked];
}

function searchForUnique(sudoku) {
    var possible = [];
    for (var i = 0; i < 81; i++) {
        if (sudoku[i] === 0) {
            possible[i] = [];
            possible[i] = getPossibleValues(sudoku, i);
            if (possible[i].length === 0) {
                return false;
            }
        }
    }
    return possible;
}

function removeFromArray(array, number) {
    var arr = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] !== number) {
            arr.push(array[i]);
        }
    }
    return arr;
}

function nextRandom(possible) {
    var max = 9;
    var minChoices = 0;
    for (var i = 0; i < 81; i++) {
        if (possible[i] != undefined) {
            if ((possible[i].length <= max) && (possible[i].length > 0)) {
                max = possible[i].length;
                minChoices = i;
            }
        }
    }
    return minChoices;
}

function solveSudoku(sudoku) {
    sudoku = new Array(81).fill(0);

    var saved = [];
    var savedFinal = [];
    var step;
    var toTry;
    var attempt;

    while (!isSolved(sudoku)) {
        step = searchForUnique(sudoku);
        if (step == false) {
            step = saved.pop();
            sudoku = savedFinal.pop();
        }
        toTry = nextRandom(step);
        attempt = getRandomPossibleValues(step, toTry);
        if (step[toTry].length > 1) {
            step[toTry] = removeFromArray(step[toTry], attempt);
            saved.push(step.slice());
            savedFinal.push(sudoku.slice());
        }
        sudoku[toTry] = attempt;
    }

    gameGrid(sudoku);
}

//first solve sudoku and draw a grid
solveSudoku(sudoku);