const valueLabel = document.getElementById("valueLabel")
const cashLabel = document.getElementById("cashLabel")
const priceLabel = document.getElementById("priceLabel")
const qtyInput = document.getElementById("qtyInput")
const buyBtn = document.getElementById("buyBtn")
const sellBtn = document.getElementById("sellBtn")
const positionLabel = document.getElementById("positionLabel")

let cash = 10000
let value = 10000
let sharesOwned = 0
let stockName = "Potato Co"
let stockPrice = 100

function updateUI(){
    valueLabel.textContent = `Value: $${value}`
    cashLabel.textContent = `Cash: $${cash}`
    positionLabel.textContent = `Your position: ${sharesOwned} shares of ${stockName}`
}

function buyStock(amount) {
    const cost = amount * stockPrice
    if (cash >= cost) {
        cash -= cost
        sharesOwned += amount
        updateUI()
    }
}

function sellStock(amount) {
    if (sharesOwned >= amount) {
        sharesOwned -= amount
        cash += amount * stockPrice
        updateUI()
    }
}

buyBtn.addEventListener("click", () => buyStock(parseInt(qtyInput.value)))
sellBtn.addEventListener("click", () => sellStock(parseInt(qtyInput.value)))