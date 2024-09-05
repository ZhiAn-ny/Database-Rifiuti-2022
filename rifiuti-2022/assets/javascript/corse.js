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

