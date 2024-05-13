
var balance = 500
var currentChipSelected = 0;

var currentBet = 0;
var currentChips = [];

const centerImg = document.getElementById("centerPic")

function updateBalance()
{
    document.getElementById("balance").innerHTML = balance;
    document.getElementById("balance2").innerHTML = balance;
    document.getElementById("totalBet").innerHTML = currentBet;

}

function pokerChipSelected(value)
{

    if (value > balance) return alert(`Too broke my nigga, thats a $${value} chip right there, buddy!\nYour sorry ass only has $${balance} left!`)

    if (currentChipSelected) {
        document.getElementById("poker"+currentChipSelected).style.border = "0"
        document.getElementById("poker"+currentChipSelected).style.borderRadius = "0px";
        document.getElementById("poker"+currentChipSelected).style.backgroundColor ="transparent";    
    }
    document.getElementById("poker"+value).style.border = "5px rgb(253, 0, 0) solid";
    document.getElementById("poker"+value).style.borderRadius = "5px";
    document.getElementById("poker"+value).style.backgroundColor ="rgb(243, 158, 48)";
    document.getElementById("chipSelected").innerHTML = value;
    currentChipSelected = Number(value);
}

function dropChip() 
{
    if (currentChipSelected == 1000) {
        currentChipSelected= 500;
    } else if (currentChipSelected == 500) {
        currentChipSelected= 100;
    } else if (currentChipSelected == 100) {
        currentChipSelected= 25;
    } else if (currentChipSelected == 25) {
        currentChipSelected = 5 
    } else {
        currentChipSelected= 1
    }
}

function chipIn()
{
    if (!currentChipSelected) return alert("Select a chip, nigga!")
    if (currentChipSelected > balance && currentChipSelected != 1) {
        document.getElementById("poker"+currentChipSelected).style.border = "0"
        document.getElementById("poker"+currentChipSelected).style.borderRadius = "0px";
        document.getElementById("poker"+currentChipSelected).style.backgroundColor ="transparent";
        dropChip();
        pokerChipSelected(currentChipSelected)
    }
    if (currentChipSelected > balance) {return alert("NIGGA YOU'RE DEAD BROKE!")}
    currentChips.push(currentChipSelected);
    currentBet += currentChipSelected;
    balance -= Number(currentChipSelected)
    updateBalance();

    const centerImg = document.getElementById("centerPic")
    centerImg.setAttribute("src", `images/poker${currentChipSelected}.png`)
    document.getElementById("betAmountLabel").innerHTML = currentBet
    
}

function chipOut()
{
    if (!currentChipSelected || !currentChips.length) return alert("Put a chip in first, nigga!")
    
    balance += currentChips[currentChips.length-1];
    currentBet -= currentChips[currentChips.length-1];
    currentChips.pop();
    document.getElementById("betAmountLabel").innerHTML = currentBet
    updateBalance();
    centerImg.setAttribute("src", `images/poker${currentChips[currentChips.length-1]}.png`)

    if (!currentChips.length) centerImg.setAttribute("src","")
}


const welcomeScreen = document.getElementById("welcomeScreen")
const gameScreen = document.getElementById("gameScreen")

function changeScreen() 
{
    if (!currentBet) return alert("Place a bet first nigga!")
    welcomeScreen.style.visibility = "hidden"
    gameScreen.style.visibility = "visible"
    playerOptionsContainer.style.visibility = "visible" 
}


function drawCard()
{
    let randomDeck = Math.floor(Math.random()*newDeck.length)
    let selectedCard = newDeck[randomDeck][newDeck[randomDeck].length-1]
    newDeck[randomDeck].pop()
    updateCount(selectedCard)
    return selectedCard;

}

var houseCards = []
var playerCards = []
var houseTotal = 0
var playerTotal = 0

const playerCardsVisual = document.getElementById("playerCardsVisual") // div with player's cards
const houseCardsVisual = document.getElementById("houseCardsVisual") // div with houses cards

// initialize arrays for pics
var playerPics = new Array();
var housePics = new Array();
var oldBet = 0
function initialDraw() 
{
    oldBet = currentBet;
    // Draw 2 cards for both player, and house
    houseCards.push(drawCard())
    playerCards.push(drawCard())
    houseCards.push(drawCard())
    playerCards.push(drawCard())



    // Get total for player:
    updatePlayer()

    //Update total for player
    document.getElementById("playerHandTotal").innerHTML = playerTotal;

    // Show both cards for player hand
    for (let i = 0; i < playerCards.length; i++) {
        playerPics.push(document.createElement("img"))
        playerPics[i].classList.add("card")
        playerPics[i].setAttribute("src",`images/blackJackCards/${playerCards[i].suit + playerCards[i].value}.png`)
        playerCardsVisual.appendChild(playerPics[i])
    }

    // update total for house for 1 card
    houseTotal += getValue(houseCards[0])
    document.getElementById("houseHandTotal").innerHTML = houseTotal;

    // Show 1 card for house
    for (let i = 0; i < houseCards.length-1; i++) {
        housePics.push(document.createElement("img"))
        housePics[i].classList.add("card")
        housePics[i].setAttribute("src",`images/blackJackCards/${houseCards[i].suit + houseCards[i].value}.png`)
        houseCardsVisual.appendChild(housePics[i])
    }

    if (playerTotal == 21)
    {
        checkWin();
    }
    
}

function getValue(card)
{
    if (card.value == "J" || card.value == "Q" || card.value == "K") {
        return 10;
    } else if (card.value == "A") {
        return 11;
    } else {return Number(card.value);}
}

function updatePlayer() {
    playerTotal = 0
    for (card of playerCards) {
        playerTotal+= getValue(card, playerCards)
    }
    if (playerTotal > 21) {
        for (let i =0; i < playerCards.length; i++) {
            if (playerCards[i].value == 'A' && playerTotal > 21) {
                playerTotal -= 10
            }
        }
        if (playerTotal > 21) {
            checkWin();
        }
    }
    document.getElementById("playerHandTotal").innerHTML = playerTotal;
}

function updateHouse() {
    houseTotal = 0
    for (card of houseCards) {
        houseTotal+= getValue(card, houseCards)
    }
    if (houseTotal > 21) {
        for (let i =0; i < houseCards.length; i++) {
            if (houseCards[i].value == 'A' && houseTotal > 21) {
                houseTotal -= 10
            }
        }
        if (houseTotal >= 21) {
            checkWin();
        }
    }
}

function playerHit()
{
    let cardDrew = drawCard()
    playerCards.push(cardDrew)
    updatePlayer()
    
    

    for (let i = 0; i < playerCards.length; i++) {
        playerPics.push(document.createElement("img"))
        playerPics[i].classList.add("card")
        playerPics[i].setAttribute("src",`images/blackJackCards/${playerCards[i].suit + playerCards[i].value}.png`)
        playerCardsVisual.appendChild(playerPics[i])
    }

    document.getElementById("playerHandTotal").innerHTML = playerTotal;

    if (playerTotal == 21) {
        playerStand();
    }

}

function playerStand()
{

    updatePlayer();
    updateHouse();
    
    while (houseTotal < 17) {
        houseCards.push(drawCard())
        updateHouse()
    }

    //prints all house cards in object
    for (let i = 1; i < houseCards.length; i++) {
        housePics.push(document.createElement("img"))
        housePics[i].classList.add("card")
        housePics[i].setAttribute("src",`images/blackJackCards/${houseCards[i].suit + houseCards[i].value}.png`)
        houseCardsVisual.appendChild(housePics[i])
    }
    //update total
    document.getElementById("houseHandTotal").innerHTML = houseTotal;

    checkWin()


}

function playerDouble()
{
    if (balance < currentBet) {
        return alert("You don't have enough for that!")
    } else {
        balance -= currentBet
        currentBet*= 2
    }
    playerHit()
    playerStand()
}

function checkWin()
{
    if (playerTotal == 21 && houseTotal != 21) {
        playerWin()
    } else if (playerTotal > 21) {
        houseWin();
    } else if (playerTotal <= 21 && houseTotal > 21) {
        playerWin();
    } else if (playerTotal > houseTotal && playerTotal <= 21 && houseTotal <= 21) {
        playerWin();
    } else if (playerTotal < houseTotal && playerTotal <= 21 && houseTotal <= 21) {
        houseWin();
    } else {
        playerPushed()
    }
}
const winLoseText = document.getElementById("winLoseText")
const playAgainContainer = document.getElementById("playAgainContainer")
const playerOptionsContainer = document.getElementById("playerOptions")


function houseWin()
{
    winLoseText.style.visibility = "visible"
    winLoseText.innerHTML = `House wins. You've lost $${currentBet}`
    updateBalance()
    playAgainContainer.style.visibility = "visible";
    playerOptionsContainer.style.visibility = "hidden";
}

function playerWin() 
{
    winLoseText.style.visibility = "visible"
    winLoseText.innerHTML = `You win! You've won $${currentBet}`
    balance += (2*currentBet)
    updateBalance()
    currentBet = 0
    playAgainContainer.style.visibility = "visible";
    playerOptionsContainer.style.visibility = "hidden";
}

function playerPushed()
{
    winLoseText.style.visibility = "visible"
    winLoseText.innerHTML = `You've Tied! You haven't lost anything.`
    balance += currentBet
    updateBalance()
    playAgainContainer.style.visibility = "visible";
    playerOptionsContainer.style.visibility = "hidden";
}

var runningCount =0
const runningCountLabel = document.getElementById("runningCount")

function updateCount(cardNum) {
    if (getValue(cardNum) > 9) {
        runningCount--;
    } else if (getValue(cardNum) < 7) {
        runningCount++;
    }

    runningCountLabel.innerHTML = runningCount;
}

function clearGame()
{
    winLoseText.style.visibility = "hidden"
    welcomeScreen.style.visibility = "visible"
    gameScreen.style.visibility = "hidden"
    playerCards = []
    houseCards = []
    for (let i  = 0; i < housePics.length; i++) {
        housePics[i].remove()
    }
    for (let i  = 0; i < playerPics.length; i++) {
        playerPics[i].remove()
    }
    currentChips = []
    playerTotal = 0
    houseTotal = 0
    currentBet = 0
    const centerImg = document.getElementById("centerPic")
    centerImg.setAttribute("src",'')
    document.getElementById("betAmountLabel").innerHTML = 0
    playAgainContainer.style.visibility="hidden"
    document.getElementById("chipSelected").innerHTML = "0";
    for (deck of newDeck) {
        console.log(deck.length)
    }
}

function deckCreation() 
{
    const suits = ["Spades","Clubs","Diamonds","Hearts"]
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
    const deck = []
    for (const suit of suits) {
        for (const value of values) {
            deck.push({suit: suit, value: value});
        }
    }
    return deck;
}

function multipleDecks(numDecks) {
    const bigDeck = []
    for (let i=0; i<numDecks; i++) {
        bigDeck.push(deckCreation())
    }
    return bigDeck;
}

function shuffleCards(decks) {
    for (let i = 0; i < decks.length; i++) {
        for (let j=decks[i].length-1; j >= 0; j--) {
            
            let k = Math.floor(Math.random() * j);
            [decks[i][j], [decks[i][k]]] = [decks[i][k], [decks[i][j]]] 
        }
        
    }
}



const newDeck = multipleDecks(6);
shuffleCards(newDeck);
