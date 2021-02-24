// for getting the values of the form//////////////////////////////////
// function myFunction() {
//     var elements = document.getElementById("myForm").elements;

//     var obj = {};
//     for (var i = 0; i < elements.length; i++) {
//         var item = elements.item(i);
//         obj[item.name] = item.value;
//     }

//     document.getElementById("demo").innerHTML = JSON.stringify(obj);
// }

// document.getElementById('btn').onclick = () => {
//     myFunction()
// }

//toggle key////////////////////////////////////////////////////////
var submitBtn = document.getElementById("btn");
submitBtn.addEventListener("click", () => {
  var elements = document.getElementById("myForm").elements;
  var obj = {};
  for (var i = 0; i < elements.length; i++) {
    var item = elements.item(i);
    obj[item.name] = item.value;
  }
  if (Object.keys(obj).length >= 8) {
    alert("placing order");
    // palceInitialOrder(obj);
    newFutureOrder(obj);
  }
});

document.getElementById("loadBtn").addEventListener("click", () => {
  loadData();
});
document.getElementById("saveBtn").addEventListener("click", () => {
  saveData();
});
let statusChecker;
var socketData = runWebSocket();
document.querySelector("input[type=checkbox]").onchange = (e) => {
  if (e.target.checked) {
    disableInputs();
    var elements = document.getElementById("myForm").elements;
    var obj = {};
    for (var i = 0; i < elements.length; i++) {
      var item = elements.item(i);
      obj[item.name] = item.value;
    }
    palceInitialOrder(obj);
    statusChecker = setInterval(() => {
      checkSatatus(obj, socketData);
    }, 1 * 1000);
  } else {
    clearInterval(statusChecker);
    enableInputs();
  }
};

// //this is for adding the input values in the local storage and the other for retriving it from the localstorge
// document.getElementById("saveBtn").onclick = () => {
//     saveDate();
//     alert('your values have been stored');
// }
// document.getElementById("loadBtn").onclick = () => {
//     loadDate();
//     alert('your last values have been retrived');
// }

// module.exports 1= runWebSocket;
// const WebSocket = require('ws');

// const ws = new WebSocket(' wss://stream.binance.com:9443/BTCUSDT@trade');

// ws.on('open', function open() {
//     ws.send('something');
// });

// ws.on('message', function incoming(data) {
//     console.log(data);
// });
