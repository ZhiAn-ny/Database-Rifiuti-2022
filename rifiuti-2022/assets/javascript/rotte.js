function getAllRoutes() {
    return getSupabase()
        .from('Rotte')
        .select()
        .order('descrizione', { ascending: true })
        .then(res => dataOrNull(res));
}
