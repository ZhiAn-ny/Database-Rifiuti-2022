async function fetchRifiutoSelezionato() {
    try {
        const extraData = getExtraData();
        const rifiuto = extraData.rifiuto;
        let resultsTable = document.getElementById('rifiutoTable');
        createTableHeader(resultsTable, ["Data consegna", "Tipo rifiuto", "Descrizione", "Quantità", "Peso (Kg)", "Ingombrante", "Pericoloso", "Riciclabile"]);

        const newRow = document.createElement('tr');

        addCell(newRow, formatDate(rifiuto.data_scarico));
        addCell(newRow, rifiuto.tipo_rifiuto);
        addCell(newRow, rifiuto.rifiuto);
        addCell(newRow, rifiuto.quantita);
        addCell(newRow, rifiuto.peso.toFixed(2) + ' Kg');
        addCell(newRow, booleanToTicks(rifiuto.ingombrante));
        addCell(newRow, booleanToTicks(rifiuto.pericoloso));
        addCell(newRow, booleanToTicks(rifiuto.riciclabile));

        resultsTable.appendChild(newRow);

    } catch (error) { console.log(error)}
}

async function fetchRifiutiSpecifici() {
    let resultsTable = document.getElementById('rifiutiSpecificiTable');
    createTableHeader(resultsTable, ["Tipo rifiuto", "Descrizione", "Quantità", "Peso (Kg)", "Ingombrante", "Pericoloso", "Riciclabile"]);
}

async function handleRifiutiSpecificiDropdown() {
    const select = document.getElementById('rifiutiSpecificiSelect');
    const extraData = getExtraData();
    const rifiuto = extraData.rifiuto;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Scegli un rifiuto';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    const rifiutiDisponibili = await fetchRifiutiByCategoria(rifiuto.tipo_rifiuto);
    rifiutiDisponibili.forEach(rifiuto => {
        const option = document.createElement('option');
        option.value = rifiuto.rifiuto_id;
        option.text = rifiuto.rifiuto_des;
        select.appendChild(option);
    });
}

async function fetchRifiutiByCategoria(tipologia_id) {
    const { data, error } = await getSupabase()
        .rpc('get_rifiuti_by_categoria', { tipologia_id: tipologia_id })
    if (error) console.error(error)
    else return data
}

async function btnSelezionaRifiuto() {
    const rifiuto_id = document.getElementById('rifiutiSpecificiSelect').value;
    const resultsTable = document.getElementById('rifiutiSpecificiTable');
    const rifiutoSelezionato = await getRifiutoByID(rifiuto_id);
    const extraData = getExtraData();
    const lotto_id = extraData.rifiuto.lotto_appartenenza;
    if (rifiutoSelezionato != "") {
        // await aggiungiRifiutoLotto(rifiutoSelezionato, lotto)
        let rigaRifiutoPresente = updateColumnValue(resultsTable, rifiutoSelezionato.rifiuto, 1000);
        if(rigaRifiutoPresente) {
            
        } else {
            const newRow = document.createElement('tr');
            
            addCell(newRow, rifiutoSelezionato.rifiuto, true);
            addCell(newRow, rifiutoSelezionato.tipologia_des);
            addCell(newRow, rifiutoSelezionato.rifiuto_des);
            addCell(newRow, 1);
            addCell(newRow, rifiutoSelezionato.peso.toFixed(2) + ' Kg');
            addCell(newRow, booleanToTicks(rifiutoSelezionato.ingombrante));
            addCell(newRow, booleanToTicks(rifiutoSelezionato.pericoloso));
            addCell(newRow, booleanToTicks(rifiutoSelezionato.riciclabile));
    
            resultsTable.appendChild(newRow);
        }

    }
}

async function getRifiutoByID(rifiuto_id) {
    const { data, error } = await getSupabase()
        .rpc('get_rifiuto_by_id', { rifiuto_id: rifiuto_id })
    if (error) console.error(error)
    else return data[0]
}