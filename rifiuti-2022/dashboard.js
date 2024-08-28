var data = getLoginInfo();
console.log(data);

document.getElementById("userData").innerText = data.nome + ' ' + data.cognome;
document.getElementById("userEmail").innerText = data.email;
