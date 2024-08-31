let extra = getExtraData()
document.getElementById("pageTitle").innerText = "Contenuto del carico con lotto " + extra.lotto.carico_id;

async function btnAggiungiRifiuto() {
    const rifiuto = document.getElementById('rifiutiSelect').value;
    const lotto = getExtraData().lotto.carico_id;
    if (rifiuto != "") {
        await aggiungiRifiutoLotto(rifiuto, lotto)
        refreshTables([
            { table: document.getElementById('rifiutiLottoTable'), function: fetchRifiutiLotto(true) },
        ]);
    }
}
