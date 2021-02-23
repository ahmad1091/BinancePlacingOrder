const api = require("binance");

const runWebSocket = () => {
  const binanceWS = new api.BinanceWS(true);
  var data = [];
  // const streams = binanceWS.streams;
  binanceWS.onAllTickers((result) => {
    for (let i = 0; i < result.length; i++) {
      data[result[i].symbol] = {
        symbol: result[i].symbol,
        bid: result[i].bestBid,
        ask: result[i].bestAskPrsice,
        close: result[i].currentClose,
      };
    }
  });
  return data;
};

const binanceRestGenerator = (akey, skey) => {
  const binanceRest = new api.BinanceRest({
    key: akey, // Get this from your account on binance.com
    secret: skey, // Same for this
    timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: false,
    handleDrift: true,
  });
  return binanceRest;
};

const normalizePriceAndQuantity = (exchangeInfo, orderData, type) => {
  let price;
  if (type === "tp") {
    price = orderData.profit;
  } else if (type === "sl") {
    price = orderData.stop;
  } else {
    throw new Error(
      "undefined order type passed to normalizePriceAndQuantity function"
    );
  }
  for (let i = 0; i < exchangeInfo.symbols.length; i++) {
    if (exchangeInfo.symbols[i].symbol == orderData.symbol) {
      var stepSize = Math.log10(
        1 / parseFloat(exchangeInfo.symbols[2].filters[2].stepSize)
      );
      var tickSize = Math.log10(
        1 / parseFloat(exchangeInfo.symbols[0].filters[0].tickSize)
      );
      modifiedQuantity =
        Math.floor(orderData.quantity * 10 ** stepSize) / 10 ** stepSize;
      modifiedPrice = Math.floor(price * 10 ** tickSize) / 10 ** tickSize;
      return {
        modifiedQuantity: modifiedQuantity,
        modifiedPrice: modifiedPrice,
      };
    }
  }
};

const palceInitialOrder = (orderData) => {
  var binanceRest = binanceRestGenerator(orderData.akey, orderData.skey);
  if (orderData.type == 1) {
    // in case of take profit
    binanceRest
      .exchangeInfo()
      .then((res) => {
        var normalizedNumbers = normalizePriceAndQuantity(res, orderData, "tp");

        return binanceRest
          .newOrder({
            symbol: orderData.symbol,
            side: "SELL",
            type: "LIMIT",
            quantity: normalizedNumbers.modifiedQuantity,
            price: normalizedNumbers.modifiedPrice,
            timeInForce: "GTC",
            newOrderRespType: "RESULT",
          })
          .then((res) => {
            console.log("res!!!!", res);
            orderData["binanceId"] = res.clientOrderId;
            alert("take profit order placed");
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    //Stop Loss
    binanceRest
      .exchangeInfo()
      .then((res) => {
        var normalizedNumbers = normalizePriceAndQuantity(res, orderData, "sl");

        return binanceRest
          .newOrder({
            symbol: orderData.symbol,
            side: "SELL",
            type: "STOP_LOSS_LIMIT",
            quantity: normalizedNumbers.modifiedQuantity,
            stopPrice: normalizedNumbers.modifiedPrice,
            price: normalizedNumbers.modifiedPrice,
            timeInForce: "GTC",
            newOrderRespType: "RESULT",
          })
          .then((res) => {
            orderData["binanceId"] = res.clientOrderId;
            alert("stop loss order placed");
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const cancelPostion = (orderData) => {
  //cancel the order
  var binanceRest = binanceRestGenerator(orderData.akey, orderData.akey);

  binanceRest
    .cancelOrder({
      symbol: orderData.symbol,
      origClientOrderId: orderData.binanceId,
    })
    .then((res) => {
      //Get Exchange Info
      return binanceRest.exchangeInfo();
    })
    .then((res1) => {
      //Normalize Quantity
      var normalizedQuantity = normalizePriceAndQuantity(res1, orderData, "tp")
        .modifiedQuantity; //its not tp but we just need theNormalize Quantity

      //place the market order
      return binanceRest.newOrder({
        symbol: orderData.symbol,
        side: "SELL",
        type: "MARKET",
        quantity: normalizedQuantity,
        newOrderRespType: "RESULT",
      });
    })
    .then((r2) => {
      //upate status
      if (orderData.type == 1) {
        alert("TAKE PROFIT ORDER CANCELLED \n STOP-LOSS ORDER FILLED");
      } else {
        alert("TAKE PROFIT ORDER FILLED \n STOP-LOSS ORDER CANCELLED");
      }
      //Turn Off the bot
      document.querySelector("input[type=checkbox]").checked = false;
    })
    .catch((err) => {
      console.error(err);
    });
};

const checkSatatus = (orderData, socketData) => {
  var symbolData = socketData[orderData.symbol];
  console.log("Currrent Price is ;;;;", symbolData.close);
  if (orderData.type == "tp") {
    //TP
    if (symbolData.close <= orderData.stop) {
      cancelPostion(orderData);
    }
    if (symbolData.type > orderData.profit) {
      alert("take profit order filled");
      document.querySelector("input[type=checkbox]").checked = false;
    }
  } else {
    //SL
    if (symbolData.close >= orderData.profit) {
      cancelPostion(orderData);
    }
    if (symbolData.type < orderData.stop) {
      alert("stop loss order filled");
      document.querySelector("input[type=checkbox]").checked = false;
    }
  }
};

// const newFutureOrder = (orderData) => {
//   const { akey, skey, symbol, side, number, stop, profit, type } = orderData;
//   const timestamp = Date.now();
//   const baseUrl = "https://fapi.binance.com";
//   const endPoint = "/fapi/v1/order";
//   let price, otype;

//   if (type == 1) {
//     price = profit;
//     otype = "LIMIT";
//   } else if (type == 0) {
//     price = stop;
//     otype = "STOP_LOSS_LIMIT";
//   }
//   //var dataQueryString = "symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=0.003&price=6200&recvWindow=20000&timestamp=" + Date.now();
//   const queryString = `symbol=${symbol}&side=${side}&price=${price}&type=${otype}&timestamp=${timestamp}`;

//   const sign = crypto
//     .createHmac("sha256", skey)
//     .update(queryString)
//     .digest("hex");
//   const url = baseUrl + endPoint + "?" + queryString + "&signature=" + sign;
//   console.log(".......", orderData);
//   // axios
//   //   .post(url, { headers: { "X-MBX-APIKEY": akey } })
//   //   .then((res) => {
//   //     console.log(res);
//   //   })
//   //   .catch((err) => {
//   //     console.error(err);
//   //   });
// };
