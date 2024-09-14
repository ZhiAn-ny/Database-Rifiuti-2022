function fetchCorsaByID(codiceinput) {
    return getSupabase()
        .rpc('get_stabilimento_info', { stabilimento_code: codiceinput })
        .single()
        .then(res => dataOrNull(res));
}

function getAllCorse() {
    return getSupabase()
        .from('Corse')
        .select(`
            inizio, camion,
            carico, rotta,
            Rotte (codice, descrizione),
            Carichi (lotto, peso)
        `)
        .order('inizio', { ascending: true })
        .then(res => dataOrNull(res));
}

function getCorsa(dataOraInizio, camion) {
    return getSupabase()
        .from("Corse")
        .eq('inizio', dataOraInizio.toISOString())
        .eq('camion', camion)
        .select()
        .then(res => dataOrNull(res));
}

function getUtentiCorsa(dataOraInizio, camion) {
    return getSupabase()
        .from("Utenti")
        .select(`
            cf, nome, cognome,
            Esecuzione (utente, guida, inizio, camion)
        `)
        .then(res => dataOrNull(res))
        .then(datarow => datarow.flatMap(u => 
            u.Esecuzione.map(e => (
                {
                    inizio: new Date(e.inizio),
                    camion: e.camion,
                    guida: e.guida,
                    cf: u.cf,
                    nome: u.nome,
                    cognome: u.cognome
                }
            ))
        ))
        .then(exes => exes.filter(e => 
            e.camion == camion && e.inizio.toISOString() == dataOraInizio.toISOString()
        ));
}

function addNewCorsa(dataOraInizio, camion) {
    return getSupabase()
        .from('Corse')
        .insert([
            {
                inizio: dataOraInizio,
                camion: camion,
                rotta: null,
                carico: null
            }
        ])
        .select()
        .then(res => dataOrNull(res))
}

/** @returns {Promise<void>} promise of update. */
function setCaricoCorsa(dataOraInizio, camion, carico) {
    return getSupabase()
        .from('Corse')
        .update({ carico: carico })
        .eq('inizio', dataOraInizio.toISOString())
        .eq('camion', camion)
        .select()
        .then(res => dataOrNull(res))
}

/** @returns {Promise<void>} promise of update. */
function setRottaCorsa(dataOraInizio, camion, rotta) {
    return getSupabase()
        .from('Corse')
        .update({ rotta: rotta })
        .eq('inizio', dataOraInizio.toISOString())
        .eq('camion', camion)
        .select()
        .then(res => dataOrNull(res))
}

