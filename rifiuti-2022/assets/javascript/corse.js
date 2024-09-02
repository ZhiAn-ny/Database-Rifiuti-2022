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

function setCaricoCorsa(dataOraInizio, camion, carico) {
    console.log('set', dataOraInizio, camion, carico)
    return getSupabase()
        .from('Corse')
        .where('camion', camion)
        .where('inizio', dataOraInizio)
        .update({carico: carico})
        .select()
    
}

function setRottaCorsa(dataOraInizio, camion, rotta) {
}

