async function fetchTurniTable() {
    const user = getLoginInfo();
    const stabilimenti = await getStabilimentiPerUtente(user);

    if (stabilimenti) {
        let resultsTable = document.getElementById('turniTable');
        let previous = "";

        for (const item of stabilimenti) {
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

async function getStabilimentiPerUtente(user) {
    const { data, error } = await getSupabase()
        .from('Turni')
        .select()
        .eq('utente', user.cf);
    if (error) console.error(error);

    return data.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.stabilimento === value.stabilimento && t.zona === value.zona && t.comune === value.comune
        ))
    );
}