async function fetchMagazzinoRifiuti() {
    try {
        const user = getLoginInfo();
        const stabilimenti = await getStabilimentiPerUtente(user);
        const container = document.getElementById('tableContainer');

        container.innerHTML = `<div id="spinner" class="spinner-large centered"></div>`;
        for (const stabilimento of stabilimenti) {
            const infoStabilimento = await fetchStabilimentoByID_Zona_Comune(stabilimento.stabilimento, stabilimento.zona, stabilimento.comune);
            const rifiuti = await fetchRifiutiByMagazzino(stabilimento.stabilimento, stabilimento.zona, stabilimento.comune);
            if (rifiuti.length > 0) {
                let table = document.createElement('table');
                table.id = `table-${stabilimento.stabilimento}`;
                table.className = 'magazzinoTable';
                table.classList.add('greyed-out')
                
                createTableHeader(table, ["Data raccolta", "Data consegna", "Tipo rifiuto", "Descrizione", "Quantità", "Peso (Kg)", "Ingombrante", "Pericoloso", "Riciclabile"]);

                for (const rifiuto of rifiuti) {
                    const newRow = document.createElement('tr');
                    addCell(newRow, formatDate(rifiuto.data_carico));
                    addCell(newRow, formatDate(rifiuto.data_scarico));
                    addCell(newRow, rifiuto.tipo_rifiuto_des);
                    addCell(newRow, rifiuto.rifiuto);
                    addCell(newRow, rifiuto.quantita);
                    addCell(newRow, rifiuto.peso.toFixed(2) + ' Kg');
                    addCell(newRow, booleanToTicks(rifiuto.ingombrante));
                    addCell(newRow, booleanToTicks(rifiuto.pericoloso));
                    addCell(newRow, booleanToTicks(rifiuto.riciclabile));
                    if(rifiuto.rifiuto_id < 0) {
                        let btn = document.createElement("button");
                        addButtonCell(newRow, "Analizza", async function () {
                            redirectToPage('magazzino/analisi.php', user, { rifiuto: rifiuto })
                        }, btn);
                        table.appendChild(newRow);
                    } else if (!rifiuto.smaltito){
                        let btn = document.createElement("button");
                        addButtonCell(newRow, "Smaltisci", async function () {
                            await smaltisci(rifiuto.rifiuto_id, rifiuto.lotto_appartenenza)
                            refreshTables([{table: document.getElementById('tableContainer'), function: fetchMagazzinoRifiuti() }])
                        }, btn);
                        table.appendChild(newRow);
                    }
                }

                const tableLabel = document.createElement('h3');
                tableLabel.innerText = infoStabilimento.stabilimento + " - " + infoStabilimento.comune + ", " + infoStabilimento.zona;
                container.appendChild(tableLabel);

                container.appendChild(table);
            }
        }

        const spinner = document.getElementById('spinner');
        container.childNodes.forEach(child => {
            child.classList.remove('greyed-out');
        });
        container.removeChild(spinner);
    
    } catch (error) { }
}

async function fetchRifiutiByMagazzino(stabilimento_id, zona_id, codice_id) {
    const { data, error } = await getSupabase()
        .rpc('get_magazzino_rifiuti', { stabilimento_id: stabilimento_id, zona_id: zona_id, codice_id: codice_id })
    if (error) console.error(error)
    else return data
}

function setDataScarico(lotto) {
    return getSupabase()
    .from('Magazzino')
    .update({ data_scarico: new Date().toISOString() })
    .is('data_scarico', null)
    .eq('lotto', lotto)
    .select()
}

async function smaltisci(rifiuto_id, lotto_id) {
    console.log(rifiuto_id + " - " + lotto_id)
    const { data, error } = await getSupabase()
    .from('Contenuto')
    .update({ smaltito: true })
    .eq('lotto', lotto_id)
    .eq('rifiuto', rifiuto_id)
    .select()
}