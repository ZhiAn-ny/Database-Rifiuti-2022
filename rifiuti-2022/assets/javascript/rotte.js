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