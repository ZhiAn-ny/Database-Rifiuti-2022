function getAllUsers() {
    return getSupabase()
        .from("Utenti")
        .select()
        .then(res => dataOrNull(res))
}

function getAllUsersWorkedTime() {
    return getSupabase()
        .rpc('get_total_worked_time', { })
        .then(res => dataOrNull(res));
}

function getStatsUtentiCorse() {
    return getSupabase()
        .rpc('get_stats_utenti_corse', { })
        .then(res => dataOrNull(res));
}
