const supabaseUrl = 'https://xweymuycrivnwklxqhwq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXltdXljcml2bndrbHhxaHdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTc2NDM4MSwiZXhwIjoyMDM1MzQwMzgxfQ.jG4noxmSFQgQPBZ4G6b6AWtzcu5SxwBTVnR5L9gGJq0';
const { createClient } = supabase
const _supabase = createClient(supabaseUrl, supabaseKey);

const StatiCarico = Object.freeze({
    CREATO: "Creato",
    IN_CARICO: "Preso in carico",
    IN_TRANSITO: "In transito",
    CONSEGNATO: "Consegnato",
    SMALTITO: "Smaltito"
});

async function loginSito() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('pass').value;

    const { data, error } = await _supabase
        .from('Utenti')
        .select()
        .eq('email', email)
        .single();

    if (data.password == password) {
        console.log('Logged in!');
        redirectToPage('dashboard.php', data)
    }
    else {
        console.log('Wrong password!');
    }

}
async function fetchStabilimenti(tipologie = []) {
    const { data, error } = await _supabase
    .from('Stabilimenti')
    .select()
    .in('tipo', tipologie);
    if (error) console.error(error)
    else return data
}

async function fetchStabilimentoByID(codiceinput) {
    const { data, error } = await _supabase
        .rpc('get_stabilimento_info', { stabilimento_code: codiceinput })
        .single();
    if (error) console.error(error)
    else return data
}

async function fetchTurni() {
    let loginInfo = getLoginInfo();
    const { data, error } = await _supabase
        .from('Turni')
        .select()
        .eq('utente', loginInfo.cf);

    if (data) {
        let resultsTable = document.getElementById('turniTable');
        let previous = "";

        for (const item of data) {
            const stabilimento = await fetchStabilimentoByID(item.stabilimento);
            const newRow = document.createElement('tr');

            if (previous !== item.stabilimento) {
                const titleRow = document.createElement('tr');
                addCell(
                    titleRow,
                    stabilimento.stabilimento + " - " + stabilimento.zona + ", " + stabilimento.comune
                );
                resultsTable.appendChild(titleRow);
            }

            previous = item.stabilimento;
            addCell(newRow, "Da " + formatDate(item.inizio) + " a " + formatDate(item.fine));
            resultsTable.appendChild(newRow);
        }
    }
}

async function fetchCorsaByID(codiceinput) {
    const { data, error } = await _supabase
        .rpc('get_stabilimento_info', { stabilimento_code: codiceinput })
        .single();
    if (error) console.error(error)
    else return data
}

async function fetchEsecuzione() {
    let loginInfo = getLoginInfo();

    const { data, error } = await _supabase
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

    const { data, error } = await _supabase
        .rpc('get_esecuzione_info', { utente_id: loginInfo.cf });
    if (error) console.error(error)

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
                                redirectToPage('esecuzione/selezione-stabile.php', loginData, { lotto: item.carico_id })
                            }
                        } else {
                            event.target.value = item.stato;
                            event.target.text = item.stato;
                        }
                    });
                    addCell(newRow, item.peso.toFixed(2) + ' Kg');
                    let btn = document.createElement("button");
                    let loginData = getLoginInfo();
                    addButtonCell(newRow, "Gestisci carico", () => redirectToPage("esecuzione/aggiunta-rifiuti.php", loginData, { lotto: item.carico_id }), btn);
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

async function fetchRifiutiByStabilimento(stabilimento_id, zona_id, codice_id) {
    const { data, error } = await _supabase
        .rpc('get_accetazione_rifiuti', { stabilimento_id: stabilimento_id, zona_id: zona_id, codice_id: codice_id })
    if (error) console.error(error)
    else return data
}

async function fetchRifiutiByLotto(lotto) {
    const { data, error } = await _supabase
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

async function redirectToPage(url, data = "", extra_data = "") {
    sessionStorage.setItem('loginInfo', JSON.stringify(data));
    sessionStorage.setItem('extraData', JSON.stringify(extra_data));
    window.location.href = url;
}

function getLoginInfo() {
    const data = JSON.parse(sessionStorage.getItem('loginInfo'));
    return data;
}

function getExtraData() {
    const data = JSON.parse(sessionStorage.getItem('extraData'));
    return data;
}

function addCell(row, item) {
    const cell = document.createElement('td');
    cell.textContent = item;
    row.appendChild(cell);
}

function addDropdownCell(row, defaultValue, options, id) {
    const cell = document.createElement('td');
    const select = document.createElement('select');
    select.id = id;

    const defaultOption = document.createElement('option');
    defaultOption.value = defaultValue.value;
    defaultOption.text = defaultValue.text;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    options.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.text = optionData.text;
        select.appendChild(option);
    });

    cell.appendChild(select);
    row.appendChild(cell);
    return select;
}

function addButtonCell(row, text, function_on_press, button) {
    const cell = document.createElement('td');
    button.textContent = text;
    cell.appendChild(button);
    button.onclick = function_on_press;
    row.appendChild(cell);
    return button;
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

async function getStatoCarico(inizio_input, targa_input) {
    const { data, error } = await _supabase
        .rpc('get_stato_carico', { inizio_input: inizio_input, targa_input: targa_input })
        .single();
    if (error) console.error(error)
    else return data;
}

async function setStatoCarico(stato, inizio_input, targa_input) {
    switch (stato) {
        case StatiCarico.IN_CARICO:
            const { dataInCarico, errorInCarico } = await _supabase
                .rpc('set_carico_preso_in_carico', { inizio_input: inizio_input, targa_input: targa_input })
            if (errorInCarico) console.error(errorInCarico)
            return true;
        case StatiCarico.IN_TRANSITO:
            const { dataInTransito, errorInTransito } = await _supabase
                .rpc('set_carico_in_transito', { inizio_input: inizio_input, targa_input: targa_input })
            if (errorInTransito) console.error(errorInTransito)
            return true;
        case StatiCarico.CONSEGNATO:
            const userResponse = confirm("Vuoi consegnare il carico di questo camion?");
            if (userResponse) {
                const { dataConsegnato, errorConsegnato } = await _supabase
                    .rpc('set_carico_consegnato', { inizio_input: inizio_input, targa_input: targa_input })
                if (errorConsegnato) console.error(errorConsegnato)
                return userResponse;
            }
            else {
                return userResponse;
            }
    }
}

function formatDate(data) {
    const date = new Date(data);
    const formattedDate = date.toLocaleDateString('eu', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    return formattedDate;
}

function fetchLoginData() {
    const data = getLoginInfo();
    if (!data) {
        redirectToPage('login.php');
    }
}

function createTableHeader(table, columnNames) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    columnNames.forEach(name => {
        const th = document.createElement('th');
        th.textContent = name;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.insertBefore(thead, table.firstChild);
}

function booleanToTicks(bool) {
    return bool ? '\u2705' : '\u274C';
}

function refreshTables(tables_loadFuncs) {
    for (const table_loadFunc of tables_loadFuncs) {
        table_loadFunc.table.innerHTML = '';
        table_loadFunc.function;
    }
}

const options = [
    { value: 'option1', text: 'Option 1' },
    { value: 'option2', text: 'Option 2' },
    { value: 'option3', text: 'Option 3' }
];

function createDropdown(id, options, container) {
    const select = document.createElement('select');
    select.id = id;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select an option';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    options.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.text = optionData.text;
        select.appendChild(option);
    });

    container.appendChild(select);
}

async function fetchRifiuti() {
    const { data, error } = await _supabase
        .from('Rifiuti')
        .select()
        .order('descrizione', { ascending: true });
    if (error) console.error(error)
    else return data;
}

async function aggiungiRifiutoLotto(rifiuto, lotto) {
    const { data, error } = await _supabase
        .rpc('add_rifiuto_lotto', { rifiuto_input: rifiuto, lotto_input: lotto })
    if (error) console.error(error);
}

async function rimuoviRifiutoLotto(rifiuto, lotto) {
    const { data, error } = await _supabase
        .rpc('delete_rifiuto_lotto', { rifiuto_input: rifiuto, lotto_input: lotto })
    if (error) console.error(error);
    refreshTables([
        { table: document.getElementById('rifiutiLottoTable'), function: fetchRifiutiLotto() },
    ]);
}

async function consegnaLotto(lotto, stabilimento) {
    const { data, error } = await _supabase
        .rpc('consegna_lotto', { rifiuto_input: rifiuto, lotto_input: lotto })
    if (error) console.error(error);
    else return true;
}

async function handleRifiutiDropdown() {
    const select = document.getElementById('rifiutiSelect');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Scegli un rifiuto';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    const rifiutiDisponibili = await fetchRifiuti();
    rifiutiDisponibili.forEach(rifiuto => {
        const option = document.createElement('option');
        option.value = rifiuto.codice;
        option.text = rifiuto.descrizione;
        select.appendChild(option);
    });
}

async function handleStabilimentiDropdown() {
    const select = document.getElementById('stabilimentiSelect');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Scegli uno stabilimento';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    const stabilimentiDisponibili = await fetchStabilimenti([5, 3]);
    stabilimentiDisponibili.forEach(stabilimento => {
        const option = document.createElement('option');
        option.value = stabilimento.codice;
        option.text = stabilimento.descrizione;
        select.appendChild(option);
    });
}

async function btnAggiungiRifiuto() {
    const rifiuto = document.getElementById('rifiutiSelect').value;
    const lotto = getExtraData().lotto;

    if (rifiuto != "") {
        await aggiungiRifiutoLotto(rifiuto, lotto)
        refreshTables([
            { table: document.getElementById('rifiutiLottoTable'), function: fetchRifiutiLotto() },
        ]);
    }
}

async function btnConsegnaLotto() {
    const stabilimento = document.getElementById('stabilimentiSelect').value;
    const lotto = getExtraData().lotto;

    if (stabilimento != "") {
        result = await consegnaLotto(lotto, stabilimento);
        if (result) {
            redirectToPage("esecuzione.php", loginData)
        }
    }
}
