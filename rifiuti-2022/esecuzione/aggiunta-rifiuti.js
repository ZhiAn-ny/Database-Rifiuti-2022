let extra = getExtraData()
document.getElementById("pageTitle").innerText = "Contenuto del carico con lotto " + extra.lotto;

async function btnAggiungiRifiuto() {
    const rifiuto = document.getElementById('rifiutiSelect').value;
    const lotto = getExtraData().lotto;

    if (rifiuto != "") {
        await aggiungiRifiutoLotto(rifiuto, lotto)
        refreshTables([
            { table: document.getElementById('rifiutiLottoTable'), function: fetchRifiutiLotto(true) },
        ]);
    }
}
