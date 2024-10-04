async function fetchTurniTable() {
    const user = getLoginInfo();
    const stabilimenti = await getTurniUtente(user);
    const sMap = new Map();
    stabilimenti.map(s => s.stabilimento+'|'+s.zona+'|'+s.comune)
        .toSorted()
        .forEach(s => sMap.set(s, []));
    const parsed = stabilimenti.map(s => ({cod: s.stabilimento+'|'+s.zona+'|'+s.comune, data: s}))
    sMap.forEach((v, k) => v.push(...parsed.filter(s => s.cod === k).map(s => s.data)));

    if (sMap.size > 0) {
        let resultsTable = document.getElementById('turniTable');
        let previous = "";
        sMap.forEach((turni, k) => {
            turni = turni.toSorted((a,b) => new Date(a.inizio) - new Date(b.inizio));
            fetchStabilimentoByID_Zona_Comune(turni[0].stabilimento, turni[0].zona, turni[0].comune).then(stabilimento => {
                turni.forEach(item => {
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
                })
            })
        })
    }
}

async function getStabilimentiPerUtente(user) {
    const { data, error } = await getSupabase()
        .from('Turni')
        .select()
        .eq('utente', user.cf);
    if (error) console.error(error);
    
    const filteredData = data.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.stabilimento === value.stabilimento && t.zona === value.zona && t.comune === value.comune
        ))
    );
    return filteredData;
}

function getTurniUtente(user) {
    return getSupabase()
    .from('Turni')
    .select()
    .eq('utente', user.cf)
    .then(res => dataOrNull(res))
}