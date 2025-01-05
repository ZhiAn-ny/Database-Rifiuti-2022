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

function disableUser(user) {
    return getSupabase()
        .from("Utenti")
        .update({attivo: 0})
        .eq('cf', user.cf)
        .select()
        .then(res => dataOrNull(res))
        .then(data => {
            if (data != null) {
                toastSuccess("Utente disabilitato con successo")
            }
        })
}

function getStatsUtentiCorse() {
    return getSupabase()
        .rpc('get_stats_utenti_corse', { })
        .then(res => dataOrNull(res));
}

function getAllTipologieUtenti() {
    return getSupabase()
        .from("Tipologie_Utenti")
        .select()
        .then(res => dataOrNull(res));
}

function getTipologiaUtente(typeId) {
    return getSupabase()
        .from("Tipologie_Utenti")
        .select()
        .eq('codice', typeId)
        .then(res => dataOrNull(res));
}
