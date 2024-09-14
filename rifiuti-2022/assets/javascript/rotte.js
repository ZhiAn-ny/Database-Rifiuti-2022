function getAllRoutes() {
    return getSupabase()
        .from('Rotte')
        .select()
        .order('descrizione', { ascending: true })
        .then(res => dataOrNull(res));
}

function getRouteStops(routeId) {
    return getSupabase()
        .from('Tappe')
        .select(`
            rotta, codice, descrizione,
            precedente, successiva,
            Stabilimenti (codice, zona, comune, descrizione, indirizzo)
        `).eq('rotta', routeId)
        .then(res => dataOrNull(res));
}

function deleteRoute(routeId) {
    return getSupabase()
        .from('Rotte')
        .delete()
        .eq('codice', routeId)
        .then(res => dataOrNull(res));
}

function addNewRoute(description) {
    return getSupabase()
        .from('Rotte')
        .insert({ descrizione: description })
        .then(res => dataOrNull(res));
}

function addStopToRoute(routeId, stopDescription, stabilimentoPK) {
    stopDescription = stopDescription.trim();
    if (stopDescription.length < 1) {
        toastError("Inserisci una descrizione valida per la tappa.")
        return Promise.resolve(null);
    }
    const [comune, zona, codice] = stabilimentoPK.split('|');
    if (codice == null || zona == null || comune == null) {
        toastError("Selezioanre uno stabilimento.")
        return Promise.resolve(null);
    }
    return getSupabase()
        .rpc('add_tappa_to_rotta', { 
            stabilimento_id: codice,
            zona_id: zona,
            comune_zip: comune,
            rotta_id: routeId,
            description: stopDescription 
        })
        .then(res => dataOrNull(res));
}