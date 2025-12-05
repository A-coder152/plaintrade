const valueLabel = document.getElementById("valueLabel")
const cashLabel = document.getElementById("cashLabel")
const priceLabel = document.getElementById("priceLabel")
const qtyInput = document.getElementById("qtyInput")
const buyBtn = document.getElementById("buyBtn")
const sellBtn = document.getElementById("sellBtn")
const positionLabel = document.getElementById("positionLabel")

const user = {
    cash: 10000,
    value: 10000,
    selectedStock: "Potato Co",
    positions: [],
    trades: [],
}

const stocks = {
    "Potato Co": {
        price: 100
    }
}

function updateUI(){
    valueLabel.textContent = `Value: $${user.value}`
    cashLabel.textContent = `Cash: $${user.cash}`
    positionLabel.textContent = `Your position: ${user.positions[user.selectedStock]} shares of ${user.selectedStock}`
}

function buyStock(amount) {
    const cost = amount * stocks[user.selectedStock].price
    if (user.cash >= cost) {
        user.cash -= cost
        if (!(user.selectedStock in user.positions)) {
            user.positions[user.selectedStock] = amount
        } else {
            user.positions[user.selectedStock] += amount
        }
        updateUI()
    }
}

function sellStock(amount) {
    if (!(user.selectedStock in user.positions)) {return}
    if (user.positions[user.selectedStock] >= amount) {
        user.positions[user.selectedStock] -= amount
        user.cash += amount * stocks[user.selectedStock].price
        updateUI()
    }
}

buyBtn.addEventListener("click", () => buyStock(parseInt(qtyInput.value)))
sellBtn.addEventListener("click", () => sellStock(parseInt(qtyInput.value)))