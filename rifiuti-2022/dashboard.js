var data = getLoginInfo();

document.getElementById("userData").innerText = data.nome + ' ' + data.cognome;
document.getElementById("userEmail").innerText = data.email;
