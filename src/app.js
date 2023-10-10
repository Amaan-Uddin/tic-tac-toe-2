class player {
	constructor(player_sign, player_moveset) {
		this.player_sign = player_sign;
		this.player_moveset = player_moveset;
		this.count = 0;
		this.rm_move = [];
	}

	addMove(move) {
		this.player_moveset.push(move);
		this.count++;
	}

	removeMove(move) {
		this.player_moveset = this.player_moveset.filter((item) => {
			return item !== move;
		});
		this.rm_move.push(move);
		this.count--;
	}

	emptyRemove() {
		this.rm_move = [];
	}
}

const playerX = new player('X', []);
const playerO = new player('O', []);

localStorage.setItem('playerX', playerX.player_sign);
let currentPlayer = localStorage.length === 1 ? playerX : playerO;
const startingPlayer = currentPlayer;

const winningMoves = [
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
	[1, 5, 9],
	[3, 5, 7],
	[1, 4, 7],
	[2, 5, 8],
	[3, 6, 9],
];

const winnerBox = document.querySelector('.winner');
const restart = document.querySelector('.restart-btn');
const stat = document.querySelector('.stat');
stat.innerText = `${currentPlayer.player_sign} turn`;

function removeDrawPiece(player, count) {
	return new Promise((resolve, reject) => {
		player.player_moveset.forEach((tile) => {
			box = document.getElementById(tile.toString());
			box.addEventListener('click', (e) => {
				if (!player.rm_move.includes(Number(e.target.id))) {
					if (e.target.innerText.trim() !== '') {
						e.target.innerText = '';
						e.target.style.pointerEvents = 'none';
						count--;
						player.removeMove(Number(e.target.id));
						console.log(player.player_moveset, player.count, player.rm_move);
						if (count === 0) resolve(); // resolve promise when all pieces are removed
					}
				}
			});
		});
	});
}

function fixBoxPointerEvents(player) {
	for (let x of player.rm_move) {
		box = document.getElementById(x.toString());
		box.style.pointerEvents = 'all';
	}
}

async function checkDraw(cplayer) {
	if (currentPlayer.count === 5) {
		console.log(cplayer);
		console.log('remove 3 piece ');
		await removeDrawPiece(cplayer, 3);

		fixBoxPointerEvents(cplayer);

		cplayer = cplayer === playerX ? playerO : playerX;

		console.log(cplayer);
		console.log('remove 2 piece ');
		await removeDrawPiece(cplayer, 2);

		fixBoxPointerEvents(cplayer);
	}
}

const checkWin = (playerMoves) => {
	for (const moveset of winningMoves) {
		const win = moveset.every((move) => playerMoves.includes(move));
		if (win) {
			return moveset;
		}
	}
	return null;
};

function displayWinner(winset) {
	winset.forEach((id) => {
		const box = document.getElementById(id.toString());
		box.style.backgroundColor = 'lightblue';
	});
	stat.innerText = `Game over`;
	winnerBox.innerText = `${currentPlayer.player_sign} wins`;
	winnerBox.style.display = 'block';
	removeClickListeners();
}

function modifyPlayerStats(player, id) {
	player.addMove(Number(id));
	const winset = checkWin(player.player_moveset);
	if (winset) {
		displayWinner(winset);
	} else {
		checkDraw(currentPlayer);
		currentPlayer = player === playerX ? playerO : playerX;
		stat.innerText = `${currentPlayer.player_sign} turn`;
	}
}

const boxes = document.querySelectorAll('.box');

function removeClickListeners() {
	boxes.forEach((box) => {
		box.removeEventListener('click', handleClick);
		box.classList.add('over');
	});
}

function handleClick(e) {
	if (!e.target.innerText) {
		e.target.innerText = currentPlayer.player_sign;
		modifyPlayerStats(currentPlayer, e.target.id);
	}
}

function handlePlayAgain() {
	if (localStorage.length === 2) localStorage.removeItem('playerO');
	else localStorage.setItem('playerO', playerO.player_sign);
	window.location.reload();
}

restart.addEventListener('click', handlePlayAgain);

boxes.forEach((box) => {
	box.addEventListener('click', handleClick);
});
