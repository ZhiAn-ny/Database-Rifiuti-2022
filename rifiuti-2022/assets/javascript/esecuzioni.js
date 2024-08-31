async function fetchEsecuzione() {
    let loginInfo = getLoginInfo();

    const { data, error } = await getSupabase()
        .rpc('get_esecuzione_info', { utente_id: loginInfo.cf });
    if (error) console.error(error)

    if (data) {
        let resultsTable = document.getElementById('esecuzioneTable');
        createTableHeader(resultsTable, ["Inizio", "Rotta", "Targa camion", "Ruolo", "Stato carico", "Peso carico"])
        for (const item of data) {
            try {
                if (item.stato == StatiCarico.CREATO) {
                    const newRow = document.createElement('tr');

                    addCell(newRow, formatDate(item.inizio));
                    addCell(newRow, item.rotta_des);
                    addCell(newRow, item.targa);
                    addCell(newRow, item.guida ? "Guida" : "Carico/Scarico rifiuti");
                    addCell(newRow, item.stato);
                    addCell(newRow, item.peso.toFixed(2) + ' Kg');
                    addButtonAccettazione(newRow, item);

                    resultsTable.appendChild(newRow);
                }
            } catch (err) { }
        }
    }
}


async function fetchEsecuzione_Proprie() {
    let loginInfo = getLoginInfo();

    let statiDropdown = [{ value: StatiCarico.IN_CARICO, text: StatiCarico.IN_CARICO },
    { value: StatiCarico.IN_TRANSITO, text: StatiCarico.IN_TRANSITO },
    { value: StatiCarico.CONSEGNATO, text: StatiCarico.CONSEGNATO }
    ];

    const { data, error } = await getSupabase()
        .rpc('get_esecuzione_info', { utente_id: loginInfo.cf });
    if (error) console.error(error)
    console.log(data)
    if (data) {
        let resultsTable = document.getElementById('esecuzione_proprieTable');
        createTableHeader(resultsTable, ["Inizio", "Rotta", "Targa camion", "Ruolo", "Stato carico", "Peso carico"])
        for (const item of data) {
            try {
                if (item.stato != StatiCarico.CREATO) {
                    const newRow = document.createElement('tr');
                    addCell(newRow, formatDate(item.inizio));
                    addCell(newRow, item.rotta_des);
                    addCell(newRow, item.targa);
                    addCell(newRow, item.guida ? "Guida" : "Carico/Scarico rifiuti");
                    dropdownSelect = addDropdownCell(newRow,
                        { value: item.stato, text: item.stato },
                        statiDropdown.filter(elem => elem.value != item.stato),
                        "DropdownStato_" + item.inizio + "_" + item.targa
                    )
                    dropdownSelect.addEventListener('change', async function (event) {
                        const stato = event.target.value;
                        const resp = await setStatoCarico(stato, item.inizio, item.targa);
                        if(resp) {
                            refreshTables([
                                { table: document.getElementById('esecuzioneTable'), function: fetchEsecuzione() },
                                { table: document.getElementById('esecuzione_proprieTable'), function: fetchEsecuzione_Proprie() }
                            ]);
                            if(stato == StatiCarico.CONSEGNATO) {
                                let loginData = getLoginInfo();
                                redirectToPage('selezione-stabile.php', loginData, { lotto: item.carico_id })
                            }
                        } else {
                            event.target.value = item.stato;
                            event.target.text = item.stato;
                        }
                    });
                    addCell(newRow, item.peso.toFixed(2) + ' Kg');
                    let btn = document.createElement("button");
                    let loginData = getLoginInfo();
                    addButtonCell(newRow, "Gestisci corsa", () => redirectToPage("aggiunta-rifiuti.php", loginData, { lotto: item.carico_id }), btn);
                    if (item.stato === StatiCarico.CONSEGNATO) {
                        dropdownSelect.disabled = true;
                        btn.disabled = true;
                    }
                    resultsTable.appendChild(newRow);
                }
            } catch (err) { }
        }
    }
}
