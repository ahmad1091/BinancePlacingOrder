const saveData = () => {
  localStorage.setItem("binApiKey", document.getElementById("akey").value);
  localStorage.setItem("binSecretKey", document.getElementById("skey").value);
  localStorage.setItem(
    "binQuantity",
    document.getElementById("quantity").value
  );
  localStorage.setItem("binProfit", document.getElementById("profit").value);
  localStorage.setItem("binStop", document.getElementById("stop").value);
  localStorage.setItem("binType", document.getElementById("type").value);
  localStorage.setItem("binSymbol", document.getElementById("symbol").value);
};

const loadData = () => {
  document.getElementById("akey").value = localStorage.getItem("binApiKey");
  document.getElementById("skey").value = localStorage.getItem("binSecretKey");
  document.getElementById("quantity").value = localStorage.getItem(
    "binQuantity"
  );
  document.getElementById("profit").value = localStorage.getItem("binProfit");
  document.getElementById("stop").value = localStorage.getItem("binStop");
  document.getElementById("type").value = localStorage.getItem("binType");
  document.getElementById("symbol").value = localStorage.getItem("binSymbol");
};
