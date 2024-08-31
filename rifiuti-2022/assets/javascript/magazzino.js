async function fetchMagazzinoRifiuti() {
    try {
        const user = getLoginInfo();
        console.log(user);
        const stabilimenti = await getStabilimentiPerUtente(user);
        console.log(stabilimenti);
        for (const stabilimento of stabilimenti) {
            const rifiuti = await fetchRifiutiByMagazzino(stabilimento.stabilimento, stabilimento.zona, stabilimento.comune);
            console.log(stabilimento.stabilimento, stabilimento.zona, stabilimento.comune, rifiuti);
            if(rifiuti.length > 0) {
                let resultsTable = document.getElementById('magazzinoTable');
                createTableHeader(resultsTable, ["Data raccolta", "Data consegna", "Tipo rifiuto", "Descrizione", "Quantità", "Peso (Kg)", "Ingombrante", "Pericoloso", "Riciclabile"]);
                
                for (const rifiuto of rifiuti) {
                    console.log(rifiuto);
                    const newRow = document.createElement('tr');
        
                    addCell(newRow, formatDate(rifiuto.data_carico));
                    addCell(newRow, formatDate(rifiuto.data_scarico));
                    addCell(newRow, rifiuto.tipo_rifiuto);
                    addCell(newRow, rifiuto.rifiuto);
                    addCell(newRow, rifiuto.quantita);
                    addCell(newRow, rifiuto.peso.toFixed(2) + ' Kg');
                    addCell(newRow, booleanToTicks(rifiuto.ingombrante));
                    addCell(newRow, booleanToTicks(rifiuto.pericoloso));
                    addCell(newRow, booleanToTicks(rifiuto.riciclabile));
        
                    resultsTable.appendChild(newRow);
                }
            }
        }
    } catch (error) { }
}

async function fetchRifiutiByMagazzino(stabilimento_id, zona_id, codice_id) {
    const { data, error } = await getSupabase()
        .rpc('get_magazzino_rifiuti', { stabilimento_id: stabilimento_id, zona_id: zona_id, codice_id: codice_id })
    if (error) console.error(error)
    else return data
}
