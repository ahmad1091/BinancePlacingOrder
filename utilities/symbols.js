var s = document.getElementById('symbol');

request('GET', 'https://api.binance.com/api/v3/ticker/price').then((data) => {
    var arr = JSON.parse(data.target.responseText);
    var symbolsArr = []
    for (let i = 0; i < arr.length; i++) {
        symbolsArr[i] = arr[i]['symbol']

    }
    symbolsArr.sort()
    for (let i = 0; i < arr.length; i++) {
        var node = document.createElement("option");
        node.value = symbolsArr[i]
        node.textContent = symbolsArr[i]
        s.appendChild(node);
    }

}).catch((err) => {
    console.log('err', err);

})