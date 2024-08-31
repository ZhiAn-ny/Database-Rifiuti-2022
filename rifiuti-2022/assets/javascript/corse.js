async function fetchCorsaByID(codiceinput) {
    const { data, error } = await getSupabase()
        .rpc('get_stabilimento_info', { stabilimento_code: codiceinput })
        .single();
    if (error) console.error(error)
    else return data
}
