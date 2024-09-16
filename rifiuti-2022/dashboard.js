var data = getLoginInfo();

document.getElementById("userData").innerText = data.nome + ' ' + data.cognome;
document.getElementById("userEmail").innerText = data.email;

getTipologiaUtente(data.tipo_contratto)
.then(t => {
    if (t && t.length) {
        document.getElementById("userType").innerText = t[0].descrizione;
    }
})
