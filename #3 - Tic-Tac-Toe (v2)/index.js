const btnStart = document.getElementById('start')
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');

player1Input.addEventListener('input', checkInputs);
player2Input.addEventListener('input', checkInputs);


function checkInputs() {
    if (player1Input.value.trim() !== '' && player2Input.value.trim() !== '') {
        btnStart.classList.add('border-animation'); // Adiciona a classe de "desabilitado"
    }
}


btnStart.addEventListener('click', () => {
    // Verifica se ambos os inputs estão preenchidos
    if (player1Input.value.trim() === '' || player2Input.value.trim() === '') {
        showAlert("Preencha o nome dos jogadores corretamente"); // Mostra o alerta se qualquer input estiver vazio
    } else {
        btnStart.classList.remove('border-animation');
        initializeGame(); // Chama a função para iniciar o jogo se ambos os campos estiverem preenchidos
    }
});


const boardRegions = document.querySelectorAll('#gameBoard span')
let vBoard = []
let turnPlayer = ''

function updateTitle() {
    const playerInput = document.getElementById(turnPlayer) //? Pega o input
    document.getElementById('turnPlayer').innerText = playerInput.value
}

function initializeGame() {
    vBoard = [['', '', ''], ['', '', ''], ['', '', '']]


    btnStart.innerHTML = '<span>Recomeçar</span>'

    turnPlayer = 'player1' //? Define o Input que está sendo referenciado
    document.querySelector('h2').innerHTML = 'Vez de: <span class="text-bg" id="turnPlayer"></span>'
    updateTitle()

    boardRegions.forEach((e) => {
        e.classList.add('cursor-pointer')
        e.classList.remove('cursor-not-allowed')

        e.classList.remove('win')
        e.innerText = ''
        e.addEventListener('click', handleBoardClick)
    })
}

function getWinRegions() {
    const winRegions = []
    const winningCombinations = [
        ["0.0", "0.1", "0.2"], // Linha 1
        ["1.0", "1.1", "1.2"], // Linha 2
        ["2.0", "2.1", "2.2"], // Linha 3
        ["0.0", "1.0", "2.0"], // Coluna 1
        ["0.1", "1.1", "2.1"], // Coluna 2
        ["0.2", "1.2", "2.2"], // Coluna 3
        ["0.0", "1.1", "2.2"], // Diagonal principal
        ["0.2", "1.1", "2.0"]  // Diagonal secundária
    ]

    winningCombinations.forEach(combination => {
        const [a, b, c] = combination.map(coord => {
            const [row, col] = coord.split('.').map(Number)
            return vBoard[row][col]
        })

        if (a && a === b && a === c) {
            winRegions.push(...combination)
        }
    })

    return winRegions
}


function disbaleRegion(element) {
    element.classList.remove('cursor-pointer')
    element.classList.add('cursor-not-allowed')
    element.removeEventListener('click', handleBoardClick)
}

let player1Wins = 0; // Contador para vitórias do Jogador X
let player2Wins = 0; // Contador para vitórias do Jogador O

function handleWin(regions) {
    regions.forEach((region) => {
        document.querySelector('[data-region="' + region + '"]').classList.add('win')
    })
    const player = document.getElementById(turnPlayer).value
    document.querySelector('h2').innerHTML = player + ' venceu'
    // Incrementa o contador de vitórias
    if (turnPlayer === 'player1') {
        player1Wins++;
        document.getElementById('player1Wins').innerText = player1Wins; // Atualiza o contador na tela
    } else {
        player2Wins++;
        document.getElementById('player2Wins').innerText = player2Wins; // Atualiza o contador na tela
    }

    boardRegions.forEach((region) => {
        disbaleRegion(region)
    })
}

function handleBoardClick(e) {
    const span = e.target
    const region = span.dataset.region
    const rowCollumPair = region.split('.') // ["N", "N"]
    const row = rowCollumPair[0]
    const column = rowCollumPair[1]

    if (turnPlayer === 'player1') {
        span.innerText = 'X'
        vBoard[row][column] = 'X'
    } else {
        span.innerText = 'O'
        vBoard[row][column] = 'O'
    }

    console.clear()
    console.table(vBoard)
    disbaleRegion(span)

    const winRegions = getWinRegions()
    if (winRegions.length > 0) {
        handleWin(winRegions)
    } else if (vBoard.flat().includes('')) {
        turnPlayer = turnPlayer === 'player1' ? 'player2' : 'player1'
        updateTitle()
    } else {
        document.querySelector('h2').innerHTML = 'Deu velha'
    }
}

function showAlert(message) {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    
    alertMessage.innerText = message;
    alertBox.style.display = 'block';
  }
  
  document.getElementById('closeAlert').addEventListener('click', () => {
    document.getElementById('customAlert').style.display = 'none';
  });