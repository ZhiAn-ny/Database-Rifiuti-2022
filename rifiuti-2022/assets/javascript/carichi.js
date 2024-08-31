const StatiCarico = Object.freeze({
    CREATO: "Creato",
    IN_CARICO: "Preso in carico",
    IN_TRANSITO: "In transito",
    CONSEGNATO: "Consegnato",
    SMALTITO: "Smaltito"
});

async function getStatoCarico(inizio_input, targa_input) {
    const { data, error } = await getSupabase()
        .rpc('get_stato_carico', { inizio_input: inizio_input, targa_input: targa_input })
        .single();
    if (error) console.error(error)
    else return data;
}

async function setStatoCarico(stato, inizio_input, targa_input) {
    switch (stato) {
        case StatiCarico.IN_CARICO:
            const { dataInCarico, errorInCarico } = await getSupabase()
                .rpc('set_carico_preso_in_carico', { inizio_input: inizio_input, targa_input: targa_input })
            if (errorInCarico) console.error(errorInCarico)
            return true;
        case StatiCarico.IN_TRANSITO:
            const { dataInTransito, errorInTransito } = await getSupabase()
                .rpc('set_carico_in_transito', { inizio_input: inizio_input, targa_input: targa_input })
            if (errorInTransito) console.error(errorInTransito)
            return true;
        case StatiCarico.CONSEGNATO:
            const userResponse = confirm("Vuoi consegnare il carico di questo camion?");
            return userResponse;
    }
}

/**
 * Requires: rifiuti.js
 * @param {Boolean} include_removeBtn 
 */
async function fetchRifiutiLotto(include_removeBtn) {
    try {
        const lotto = getExtraData().lotto;
        let resultsTable = document.getElementById('rifiutiLottoTable');
        const rifiuti = await fetchRifiutiByLotto(lotto);
        createTableHeader(resultsTable, ["Descrizione rifiuto", "Quantità"]);

        for (const rifiuto of rifiuti) {
            const newRow = document.createElement('tr');

            addCell(newRow, rifiuto.rifiuto_des);
            addCell(newRow, rifiuto.qta);
            if(include_removeBtn) {
                let btn = document.createElement("button");
                let lotto = getExtraData().lotto;
                addButtonCell(newRow, booleanToTicks(false), () => rimuoviRifiutoLotto(rifiuto.rifiuto_id, lotto), btn);
            }

            resultsTable.appendChild(newRow);
        }
    } catch (error) { }
}

async function aggiungiRifiutoLotto(rifiuto, lotto) {
    const { data, error } = await getSupabase()
        .rpc('add_rifiuto_lotto', { rifiuto_input: rifiuto, lotto_input: lotto })
    if (error) console.error(error);
}

async function rimuoviRifiutoLotto(rifiuto, lotto) {
    const { data, error } = await getSupabase()
        .rpc('delete_rifiuto_lotto', { rifiuto_input: rifiuto, lotto_input: lotto })
    if (error) console.error(error);
    refreshTables([
        { table: document.getElementById('rifiutiLottoTable'), function: fetchRifiutiLotto() },
    ]);
}

async function consegnaLotto(lotto, stabilimento, zona, comune) {
    const { data, error } = await getSupabase()
        .rpc('consegna_lotto', { lotto_input: lotto, stabilimento_input: stabilimento, zona_input: zona, comune_input: comune })
    if (error) console.error(error);
    else return true;
}

async function btnConsegnaLotto() {
    const stabilimentoSelezionato = document.getElementById('stabilimentiSelect').value;
    const lotto = getExtraData().lotto;
    const stabilimento = stabilimentoSelezionato.split(",");
    if (stabilimento != "") {
        result = await consegnaLotto(lotto, stabilimento[0], stabilimento[1], stabilimento[2]);
        if (result) {
            const loginData = getLoginInfo();
            redirectPreviousPage(loginData)
        }
    }
}

async function addButtonAccettazione(row, row_data) {
    let btn = document.createElement("button");
    addButtonCell(row, "Accetta", async function () {
        row.parentNode.removeChild(row);
        await setStatoCarico(StatiCarico.IN_CARICO, row_data.inizio, row_data.targa);
        refreshTables([
            { table: document.getElementById('esecuzioneTable'), function: fetchEsecuzione() },
            { table: document.getElementById('esecuzione_proprieTable'), function: fetchEsecuzione_Proprie() }
        ]);
    }, btn);
}
