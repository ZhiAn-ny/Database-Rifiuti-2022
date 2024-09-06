function getAllUsers() {
    return getSupabase()
        .from("Utenti")
        .select()
        .then(res => dataOrNull(res))
}