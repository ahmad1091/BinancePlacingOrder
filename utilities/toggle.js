const disableInputs = () => {
    document.getElementById('akey').disabled = true;
    document.getElementById('skey').disabled = true;
    document.getElementById('quantity').disabled = true;
    document.getElementById('profit').disabled = true;
    document.getElementById('stop').disabled = true;
    document.getElementById('type').disabled = true;
    document.getElementById('symbol').disabled = true;

}
const enableInputs = () => {
    document.getElementById('akey').disabled = false;
    document.getElementById('skey').disabled = false;
    document.getElementById('quantity').disabled = false;
    document.getElementById('profit').disabled = false;
    document.getElementById('stop').disabled = false;
    document.getElementById('type').disabled = false;
    document.getElementById('symbol').disabled = false;

}