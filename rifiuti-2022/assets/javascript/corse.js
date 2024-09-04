async function fetchCorsaByID(codiceinput) {
    const { data, error } = await getSupabase()
        .rpc('get_stabilimento_info', { stabilimento_code: codiceinput })
        .single();
    if (error) console.error(error)
    else return data
}

async function getAllCorse() {
    const {data, error} = await getSupabase()
        .from('Corse')
        .select();
    if (error) console.error(error)
    else return data
}

async function addNewCorsa(dataOraInizio, camion) {
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
}

/** @returns {Promise<void>} promise of update. */
function setCaricoCorsa(dataOraInizio, camion, carico) {
    return getSupabase()
        .from('Corse')
        .update({ carico: carico })
        .eq('inizio', dataOraInizio.toISOString())
        .eq('camion', camion)
        .select()
}

/** @returns {Promise<void>} promise of update. */
function setRottaCorsa(dataOraInizio, camion, rotta) {
    return getSupabase()
        .from('Corse')
        .update({ rotta: rotta })
        .eq('inizio', dataOraInizio.toISOString())
        .eq('camion', camion)
        .select()
}

