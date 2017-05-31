var grid = gameGrid(9, 9);

document.getElementById("sudoku").innerHTML = "Sudoku";
document.getElementById("game").appendChild(grid);
     
function gameGrid(rows, cols){
    var i = 0;
    var grid = document.createElement('div');
    grid.className = 'body'; 
    for (var r = 0; r < rows; ++r){
        var row = document.createElement('div'); 
        row.className = 'row'; 
        for (var c = 0; c < cols; ++c){
            var cell = document.createElement('div'); 
            cell.className = 'cell'; 
            cell.innerHTML = ++i;
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
    return grid;
}