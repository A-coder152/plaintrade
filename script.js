const valueLabel = document.getElementById("valueLabel")
const cashLabel = document.getElementById("cashLabel")
const priceLabel = document.getElementById("priceLabel")
const qtyInput = document.getElementById("qtyInput")
const buyBtn = document.getElementById("buyBtn")
const sellBtn = document.getElementById("sellBtn")
const positionLabel = document.getElementById("positionLabel")
const stockSelector = document.getElementById("stockSelector")

const user = {
    cash: 10000,
    value: 10000,
    selectedStock: "Potato Co",
    positions: {},
    trades: [],
}

const stocks = {
    "Potato Co": {price: 100},
    "Orange Inc": {price: 50},
    "Banana Corp": {price: 200},
    "Pineapple Ltd": {price: 500},
    "Chicken Nugget": {price: 10}
}

function updateSelector(){
    stockSelector.innerHTML = ""
    Object.keys(stocks).forEach(stock => {
        const stockOption = document.createElement("option")
        stockOption.value = stock
        stockOption.textContent = stock
        stockSelector.appendChild(stockOption)
    })
}

function updateStocks(){
    Object.keys(stocks).forEach(stock => {
        stocks[stock].price *= 1 + (Math.random() - 0.5) * 0.1
    })
    updatePortfolio()
    setTimeout(updateStocks, 3000)
}

function updatePortfolio() {
    const stocksValue = Object.entries(user.positions).reduce((sum, [stock, qty]) => {
        return sum + qty * stocks[stock].price
    }, 0)
    user.value = user.cash + stocksValue
    updateUI()
}

function updateUI(){
    valueLabel.textContent = `Value: $${user.value.toFixed(2)}`
    cashLabel.textContent = `Cash: $${user.cash.toFixed(2)}`
    priceLabel.textContent = `Stock Price: $${stocks[user.selectedStock].price.toFixed(2)}`
    if (user.positions[user.selectedStock]) {
        positionLabel.textContent = `Your position: ${user.positions[user.selectedStock]} shares of ${user.selectedStock}`
    } else {
        positionLabel.textContent = "No position for the selected stock."
    }
}

function buyStock(amount) {
    if (amount <= 0) {return}
    const cost = amount * stocks[user.selectedStock].price
    if (user.cash >= cost) {
        user.cash -= cost
        if (!(user.selectedStock in user.positions)) {
            user.positions[user.selectedStock] = amount
        } else {
            user.positions[user.selectedStock] += amount
        }
        updatePortfolio()
    }
}

function sellStock(amount) {
    if (amount <= 0) {return}
    if (!(user.selectedStock in user.positions)) {return}
    if (user.positions[user.selectedStock] >= amount) {
        user.positions[user.selectedStock] -= amount
        if (user.positions[user.selectedStock] == 0) {delete user.positions[user.selectedStock]}
        user.cash += amount * stocks[user.selectedStock].price
        updatePortfolio()
    }
}

buyBtn.addEventListener("click", () => buyStock(parseInt(qtyInput.value)))
sellBtn.addEventListener("click", () => sellStock(parseInt(qtyInput.value)))

stockSelector.addEventListener("change", (event) => {
    user.selectedStock = event.target.value
    updateUI()
})

updateSelector()
updateStocks()