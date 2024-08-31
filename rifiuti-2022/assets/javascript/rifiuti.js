async function fetchRifiuti() {
    const { data, error } = await getSupabase()
        .from('Rifiuti')
        .select()
        .order('descrizione', { ascending: true });
    if (error) console.error(error)
    else return data;
}

async function fetchRifiutiGenerici() {
    const { data, error } = await _supabase
        .rpc('get_rifiuti_generici', '')
        console.log(data)
    if (error) console.error(error);
    else return data;
}

async function fetchRifiutiByStabilimento(stabilimento_id, zona_id, codice_id) {
    const { data, error } = await getSupabase()
        .rpc('get_accettazione_rifiuti', { stabilimento_id: stabilimento_id, zona_id: zona_id, codice_id: codice_id })
    if (error) console.error(error)
    else return data
}

async function fetchRifiutiByLotto(lotto) {
    const { data, error } = await getSupabase()
        .rpc('get_rifiuti_lotto', { lotto_input: lotto })
    if (error) console.error(error)
    else return data
}

async function fetchAccettazioneRifiuti() {
    try {
        const rifiuti = await fetchRifiutiByStabilimento("0001", 1, 12345);

        let resultsTable = document.getElementById('accettazioneTable');

        createTableHeader(resultsTable, ["Data consegna", "Tipo rifiuto", "Descrizione", "Quantità", "Peso (Kg)", "Ingombrante", "Pericoloso", "Riciclabile"]);

        for (const rifiuto of rifiuti) {
            const newRow = document.createElement('tr');

            addCell(newRow, formatDate(rifiuto.data));
            addCell(newRow, rifiuto.tipo_rifiuto);
            addCell(newRow, rifiuto.rifiuto);
            addCell(newRow, rifiuto.quantita);
            addCell(newRow, rifiuto.peso.toFixed(2) + ' Kg');
            addCell(newRow, booleanToTicks(rifiuto.ingombrante));
            addCell(newRow, booleanToTicks(rifiuto.pericoloso));
            addCell(newRow, booleanToTicks(rifiuto.riciclabile));

            resultsTable.appendChild(newRow);
        }
    } catch (error) { }
}


async function handleRifiutiDropdown() {
    const select = document.getElementById('rifiutiSelect');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Scegli un rifiuto';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    const rifiutiDisponibili = await fetchRifiutiGenerici();
    rifiutiDisponibili.forEach(rifiuto => {
        const option = document.createElement('option');
        option.value = rifiuto.tipologia_id;
        option.text = rifiuto.tipologia_des;
        select.appendChild(option);
    });
}
