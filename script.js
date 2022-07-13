const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageContainer = document.querySelector('.message-container')

const wordle = 'SUPER'
let wordleArray = wordle.split("")
console.log(wordleArray)
const restartButton = document.querySelector('.restart')


const keys = [
    'Q', 
    'W', 
    'E', 
    'R', 
    'T', 
    'Y', 
    'U', 
    'I', 
    'O', 
    'P', 
    'A', 
    'S', 
    'D', 
    'F', 
    'G', 
    'H', 
    'J', 
    'K', 
    'L', 
    'ENTER', 
    'Z', 
    'X', 
    'C', 
    'V', 
    'B', 
    'N', 
    'M', 
    'DEL', 
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentRow, currentTile, isGameOver
startGame()

function startGame(){
    currentRow = 0
    currentTile = 0
    isGameOver = false
    wordleArray = wordle.split("")
}

function endGame(win){
    //create a button to retart 
    //display results

    restartButton.classList.add('active')
    restartButton.addEventListener('click', resetGame)
    
}

function resetGame(){
    restartButton.classList.remove('active')
    const keys = [...keyboard.querySelectorAll('button')]

    console.log(keys)
    keys.forEach(key => {
        if(key.style.backgroundColor != null){
            key.style.backgroundColor = null
        }
        key.removeAttribute('data-bg')
    })

    const tiles = [...tileDisplay.querySelectorAll('.tile')]


    tiles.forEach(tile => {
        tile.style.backgroundColor = null
        tile.removeAttribute('data-bg')
        tile.classList.remove('flip')
        tile.textContent = ""
    })
    console.log(tiles)

    startGame()
}



guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElem = document.createElement('div')
    rowElem.classList.add('row')
    rowElem.setAttribute('id', 'guessRow-' + guessRowIndex )

    guessRow.forEach((guess, guessIndex) => {
        const tileElem = document.createElement('div')
        tileElem.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElem.classList.add('tile')
        tileElem.dataset.row = guessRowIndex
        rowElem.append(tileElem)
    })

    tileDisplay.append(rowElem) 
})


keys.forEach(key => {
    const buttonElem = document.createElement('button')
    buttonElem.textContent = key
    buttonElem.setAttribute('id', key)
    buttonElem.addEventListener('click', () => {
        handleClick(key)
    })
    keyboard.append(buttonElem)

})


const handleClick = (letter) => {
    console.log('clicked', letter)
    if(letter === 'DEL'){
        deleteLetter()
        console.log(guessRows)
        return
    }
    if(letter === 'ENTER'){
        checkRow()
        console.log(guessRows)
        if(isGameOver){
            if(won){
                setTimeout(() => endGame(true), 5000)
            }
            else{
                setTimeout(() => endGame(false), 5000)
            }
        }
        return
    }
    addLetter(letter)
    console.log(guessRows)

}

function addLetter(letter){
    if(currentTile < 5 && currentRow < 6){
        const tile = document.getElementById
            ('guessRow-' + currentRow + '-tile-' + currentTile)

        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
}
 
function deleteLetter(){
    if(currentTile > 0){
        currentTile--
        const tile = document.getElementById
                ('guessRow-' + currentRow + '-tile-' + currentTile)

        tile.textContent = ""
        guessRows[currentRow][currentTile] = ""
        tile.setAttribute('data', "")
    }
}

let won
function checkRow(){
    const guess = guessRows[currentRow].join('')

    if(currentTile > 4){
        if(guess === wordle) {
            animate()
            won = true
            showMessage(`Magnificient! you guessed the wordle correctly in 
            ${currentRow + 1} tries`)
            isGameOver = true
            return
        }
        else {
            if(currentRow >= 5) {
                animate()
                won = false
                isGameOver = true
                showMessage('Game Over, try again')
                return
            }
            if(currentRow < 5) {
                animate()
                currentRow++
                wordleArray = wordle.split("")
                currentTile = 0
            }
        }

    }
}

function showMessage(message){
    const messageElem = document.createElement('p')
    messageElem.textContent = message
    messageContainer.append(messageElem)

    setTimeout(() => messageContainer.removeChild(messageElem), 2000)
}


function animate(){
    let index = 0
    let greenIndex = 0;
    let yellowIndex = 0;

    const keys = [...keyboard.querySelectorAll('button')]
    const tiles = [...tileDisplay.querySelectorAll('.tile')]
    let checkTiles = [...tileDisplay.querySelectorAll(`[data-row="${currentRow}"`)]

    console.log(keys)
    console.log(tiles)


    // go thru one time each determining correct background color (1st: green, 2nd: yellow, 3rd: gray)
    // add it to the key and tile as a data attribute
    // then go thru each key and tile sequentially and change the bacgkroundcolor (animation) based off of corresponding data-attribute


    guessRows[currentRow].forEach(letter => {
        if(letter === wordleArray[greenIndex]){
            console.log('TEST')
            //find the button elem inside keybaord with same id as letter
            let correctKey = keys.find((key) => {
                return key.id === letter
            })

            let correctTile = tiles.find((tile) => {
                return tile.id === `guessRow-${currentRow}-tile-${greenIndex}`
            })
            correctTile.dataset.bg = "green"
            correctKey.dataset.bg = "green"
            wordleArray[greenIndex] = ""
        }
        greenIndex++
    })
    guessRows[currentRow].forEach(letter => {
        if(wordleArray.includes(letter)){
            let incorrectPlacementKey = keys.find((key) => {
                return key.id === letter
            })
            
            let incorrectPlacementTile = tiles.find((tile) => {
                return tile.id === `guessRow-${currentRow}-tile-${yellowIndex}`
            })

            incorrectPlacementTile.dataset.bg = "#b38a04"
            incorrectPlacementKey.dataset.bg = "#b38a04"
            let incorrectPlacementWordleIndex = wordleArray.findIndex(char => {
                return char == letter
            })
            wordleArray[incorrectPlacementWordleIndex] = ""

        }
        yellowIndex++
    })

    guessRows[currentRow].forEach(letter => {

            let wrongKey = keys.find((key) => {
                return key.id === letter
            })

            let wrongTile = tiles.find((tile) => {
                return tile.id === `guessRow-${currentRow}-tile-${index}`
            })

            index++
            console.log(wrongKey)
            console.log(wrongTile)
            if(wrongTile.hasAttribute('data-bg')) {
                if(wrongTile.dataset.bg !== "#202124"){
                    return
                }
            }
            else{
                wrongTile.dataset.bg = "#202124"
                wrongKey.dataset.bg = "#202124"
                wordleArray[index] = ""
            }
    })



    //go through each letter at a time in tileRow
    //see if position is right
    //if so change the tile and corresponding key background color to green 
    //else if letter is in the wordle then change to yellow
    //else change tile background to gray and key background to black


    // keys.forEach(key => {
    //     if(key.dataset.bg != null){
    //         key.style.backgroundColor = `${key.dataset.bg}`
        
    // }})

    console.log(checkTiles)
    checkTiles.forEach((tile, index) => {
        console.log(tile)
        console.log(index)
        setTimeout(() => {
            tile.classList.add('flip')
            tile.style.backgroundColor = `${tile.dataset.bg}`
            //FIND THE CORRESPONDING KEY AND CHANGE ITS BACKGROUND
            console.log("HELPPPP")

            let changeKey = keyboard.querySelector(`#${tile.textContent}`)
            changeKey.style.backgroundColor = `${changeKey.dataset.bg}`

        }, 500 * index)
    })

    console.log(wordleArray)
    console.log(keys)
    console.log(tiles)
}