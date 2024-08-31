

async function fetchTurni() {
    let loginInfo = getLoginInfo();
    const { data, error } = await getSupabase()
        .from('Turni')
        .select()
        .eq('utente', loginInfo.cf);

    if (data) {
        let resultsTable = document.getElementById('turniTable');
        let previous = "";

        for (const item of data) {
            const stabilimento = await fetchStabilimentoByID_Zona_Comune(item.stabilimento, item.zona, item.comune);
            const newRow = document.createElement('tr');

            if (previous !== item.stabilimento) {
                const titleRow = document.createElement('tr');
                titleRow.classList.add('titleRow');
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