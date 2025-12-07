const valueLabel = document.getElementById("valueLabel")
const cashLabel = document.getElementById("cashLabel")
const priceLabel = document.getElementById("priceLabel")
const qtyInput = document.getElementById("qtyInput")
const buyBtn = document.getElementById("buyBtn")
const sellBtn = document.getElementById("sellBtn")
const positionLabel = document.getElementById("positionLabel")
const stockSelector = document.getElementById("stockSelector")
const positionsDiv = document.getElementById("positionsDiv")
const tradesDiv = document.getElementById("tradesDiv")
const resetBtn = document.getElementById("resetBtn")
const watchlistBtn = document.getElementById("watchlistBtn")
const watchlistDiv = document.getElementById("watchlistDiv")
const homeBtn = document.getElementById("homeBtn")
const tradeBtn = document.getElementById("tradeBtn")

let user = {
    cash: 10000,
    value: 10000,
    selectedStock: "Potato Co",
    positions: {},
    trades: [],
    valueList: [],
}

const stocks = {
    "Potato Co": {price: 100, watchlist: false},
    "Orange Inc": {price: 50, watchlist: false},
    "Banana Corp": {price: 200, watchlist: false},
    "Pineapple Ltd": {price: 500, watchlist: false},
    "Chicken Nugget": {price: 10, watchlist: false}
}

function formatDate(timestamp){
    const date = new Date(timestamp)
    const dayName = date.toLocaleDateString('en-US', {weekday: "short"})
    const timeString = date.toLocaleTimeString('en-US', {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    })

    return `${dayName} ${timeString}`
}

function updateSelector(){
    stockSelector.innerHTML = ""
    Object.keys(stocks).forEach(stock => {
        const stockOption = document.createElement("option")
        stockOption.value = stock
        stockOption.textContent = stock
        stockSelector.appendChild(stockOption)
    })
    stockSelector.value = user.selectedStock
}

function updateTrades(){
    if (user.trades.length == 51) {user.trades.pop()}
    tradesDiv.innerHTML = `<p>Timestamp</p>
            <p>Action</p>
            <p>Stock</p>
            <p>Quantity</p>
            <p>Price</p>`
    user.trades.forEach((trade) => {
        tradesDiv.innerHTML += `
            <p>${formatDate(trade.timestamp)}</p>
            <p>${trade.action}</p>
            <p>${trade.stock}</p>
            <p>${trade.quantity}</p>
            <p>${trade.price.toFixed(2)}</p>`
    })
}

function updateWatchlist(){
    watchlistDiv.innerHTML = ""
    Object.keys(stocks).forEach(stock => {
        if (stocks[stock].watchlist){
            const newWatchlist = document.createElement("div")
            newWatchlist.onclick = () => {selectStock(stock)}
            newWatchlist.innerHTML = `
            <p>${stock}</p>
            <p>${stocks[stock].price.toFixed(2)}<p>`
            watchlistDiv.appendChild(newWatchlist)
        }
    })
}

function saveUser(){
    localStorage.setItem("user", JSON.stringify(user))
}

function loadUser(){
    if (localStorage.length) {user = JSON.parse(localStorage.getItem("user"))}
}

function updateStocks(){
    Object.keys(stocks).forEach(stock => {
        stocks[stock].price = Math.max(0.1, stocks[stock].price * (1 + (Math.random() - 0.5) * 0.1))
    })
    updatePortfolio()
    if (user) {user.valueList.push({timestamp: Date.now(), value: user.value})}
    if (user.valueList.length == 101) {user.valueList.pop()}
    setTimeout(updateStocks, 3000)
}

function updatePortfolio() {
    const stocksValue = Object.entries(user.positions).reduce((sum, [stock, stockdata]) => {
        return sum + stockdata.qty * stocks[stock].price
    }, 0)
    user.value = user.cash + stocksValue
    updateUI()
}

function updateUI(){
    valueLabel.textContent = `Value: $${user.value.toFixed(2)}`
    cashLabel.textContent = `Cash: $${user.cash.toFixed(2)}`
    priceLabel.textContent = `Stock Price: $${stocks[user.selectedStock].price.toFixed(2)}`
    if (user.positions[user.selectedStock]) {
        const position = user.positions[user.selectedStock]
        positionLabel.innerHTML = `Your position: ${position.qty} shares of ${user.selectedStock}. <br>
        Average price: $${position.avg.toFixed(2)}, unrealized P/L: $${(position.qty * (stocks[user.selectedStock].price - position.avg)).toFixed(2)}`
    } else {
        positionLabel.textContent = "No position for the selected stock."
    }
    positionsDiv.innerHTML = `<p>Name</p>
            <p>Position</p>
            <p>Average Cost</p>
            <p>Position Value</p>
            <p>Unrealized P/L</p>`
    Object.entries(user.positions).forEach(([stock, position]) => {
        positionsDiv.innerHTML += `
        <p>${stock}</p>
        <p>${position.qty}</p>
        <p>$${position.avg.toFixed(2)}</p>
        <p>$${(position.qty * stocks[stock].price).toFixed(2)}</p>
        <p>$${(position.qty * (stocks[stock].price - position.avg)).toFixed(2)}</p>`
    })
    updateTrades()
    updateWatchlist()
}

function selectStock(stock) {
    stockSelector.value = stock
    user.selectedStock = stock
    watchlistBtn.textContent = stocks[stock].watchlist ? "Remove Stock from Watchlist" : "Add Stock to Watchlist"
    updateUI()
}

function buyStock(amount) {
    if (!(amount > 0)) {return}
    const cost = amount * stocks[user.selectedStock].price
    if (user.cash >= cost) {
        user.cash -= cost
        if (!(user.selectedStock in user.positions)) {
            user.positions[user.selectedStock] = {qty: amount, avg: stocks[user.selectedStock].price}
        } else {
            const position = user.positions[user.selectedStock]
            position.avg = (position.qty * position.avg + cost) / (position.qty + amount)
            position.qty += amount
        }
        user.trades.unshift({timestamp: Date.now(), action: "buy", stock: user.selectedStock, quantity: amount, price: stocks[user.selectedStock].price})
        updateTrades()
        updatePortfolio()
        saveUser()
    }
}

function sellStock(amount) {
    if (!(amount > 0)) {return}
    if (!(user.selectedStock in user.positions)) {return}
    const position = user.positions[user.selectedStock]
    if (position.qty >= amount) {
        position.qty -= amount
        if (position.qty == 0) {delete user.positions[user.selectedStock]}
        user.cash += amount * stocks[user.selectedStock].price
        user.trades.unshift({timestamp: Date.now(), action: "sell", stock: user.selectedStock, quantity: amount, price: stocks[user.selectedStock].price})
        updateTrades()
        updatePortfolio()
        saveUser()
    }
}

buyBtn.addEventListener("click", () => buyStock(parseInt(qtyInput.value)))
sellBtn.addEventListener("click", () => sellStock(parseInt(qtyInput.value)))

stockSelector.addEventListener("change", (event) => {
    selectStock(event.target.value)
})

resetBtn.addEventListener("click", () => {
    user = {
        cash: 10000,
        value: 10000,
        selectedStock: "Potato Co",
        positions: {},
        trades: [],
        valueList: [],
    }
    saveUser()
    updateTrades()
    updateSelector()
    updatePortfolio()
})

watchlistBtn.addEventListener("click", () => {
    stocks[user.selectedStock].watchlist = !stocks[user.selectedStock].watchlist
    watchlistBtn.textContent = stocks[user.selectedStock].watchlist ? "Remove Stock from Watchlist" : "Add Stock to Watchlist"
    updateWatchlist()
})

homeBtn.addEventListener("click", () => {
    document.querySelectorAll(".trade").forEach(element => {
        element.style.display = "none"
    })
    document.querySelectorAll(".home").forEach(element => {
        element.style.display = "flex"
        if (element.classList.contains("positionsGrid") || element.classList.contains("tradesGrid")) {
            element.style.display = "grid"
        }
    })
})
tradeBtn.addEventListener("click", () => {
    document.querySelectorAll(".home").forEach(element => {
        element.style.display = "none"
    })
    document.querySelectorAll(".trade").forEach(element => {
        element.style.display = "flex"
    })
})

document.querySelectorAll(".expandoHeader").forEach(expando => {
    expando.addEventListener("click", () => {
        const content = document.getElementById(expando.getAttribute("aria-controls"))
        if (content.style.display == "none"){
            content.style.display = "flex"
            if (content.classList.contains("positionsGrid") || content.classList.contains("tradesGrid")) {
                content.style.display = "grid"
            }
        } else {content.style.display = "none"}
    })
})

loadUser()
updateTrades()
updateSelector()
updatePortfolio()
updateStocks()
