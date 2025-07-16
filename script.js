const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');
const size = 15;
const cellSize = canvas.width / size;
let board = Array.from({ length: size }, () => Array(size).fill(0));
let turn = 1; // 1: 흑, 2: 백
let gameOver = false;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    for (let i = 0; i < size; i++) {
        ctx.beginPath();
        ctx.moveTo(cellSize / 2, cellSize / 2 + i * cellSize);
        ctx.lineTo(canvas.width - cellSize / 2, cellSize / 2 + i * cellSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cellSize / 2 + i * cellSize, cellSize / 2);
        ctx.lineTo(cellSize / 2 + i * cellSize, canvas.height - cellSize / 2);
        ctx.stroke();
    }
}

function drawStones() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (board[y][x] !== 0) {
                ctx.beginPath();
                ctx.arc(
                    cellSize / 2 + x * cellSize,
                    cellSize / 2 + y * cellSize,
                    cellSize * 0.4,
                    0,
                    2 * Math.PI
                );
                ctx.fillStyle = board[y][x] === 1 ? '#222' : '#fff';
                ctx.fill();
                ctx.strokeStyle = '#222';
                ctx.stroke();
            }
        }
    }
}

function checkWin(x, y, color) {
    const directions = [
        [1, 0], [0, 1], [1, 1], [1, -1]
    ];
    for (let [dx, dy] of directions) {
        let count = 1;
        for (let dir = -1; dir <= 1; dir += 2) {
            let nx = x, ny = y;
            while (true) {
                nx += dx * dir;
                ny += dy * dir;
                if (
                    nx >= 0 && nx < size &&
                    ny >= 0 && ny < size &&
                    board[ny][nx] === color
                ) {
                    count++;
                } else {
                    break;
                }
            }
        }
        if (count >= 5) return true;
    }
    return false;
}

canvas.addEventListener('click', function (e) {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    if (board[y][x] !== 0) return;
    board[y][x] = turn;
    drawBoard();
    drawStones();
    if (checkWin(x, y, turn)) {
        document.getElementById('turn-info').textContent = (turn === 1 ? '흑돌' : '백돌') + ' 승리!';
        gameOver = true;
        return;
    }
    turn = 3 - turn;
    document.getElementById('turn-info').textContent = (turn === 1 ? '흑돌' : '백돌') + ' 차례입니다.';
});

document.getElementById('reset-btn').addEventListener('click', function () {
    board = Array.from({ length: size }, () => Array(size).fill(0));
    turn = 1;
    gameOver = false;
    document.getElementById('turn-info').textContent = '흑돌 차례입니다.';
    drawBoard();
    drawStones();
});

drawBoard();
drawStones();
